import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { RowState } from '@app/shared';
import { Observable, Subscription } from 'rxjs';
import { SuUserOrgUnits } from '../surt06.service';

export class DivisionNode {
  divCode: string;
  divName: string;
  divParent: string;
  ouCode: string;
  children?: DivisionNode[];
}

export class DivisionFlatNode extends SuUserOrgUnits {
  divName: string;
  level?: number;
  expandable?: boolean;
}

@Component({
  selector: 'app-division-tree',
  templateUrl: './division-tree.component.html',
  styleUrls: ['./division-tree.component.scss']
})
export class DivisionTreeComponent implements OnInit, OnDestroy {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<DivisionFlatNode, DivisionNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<DivisionNode, DivisionFlatNode>();

  treeControl: FlatTreeControl<DivisionFlatNode>;

  treeFlattener: MatTreeFlattener<DivisionNode, DivisionFlatNode>;

  dataSource: MatTreeFlatDataSource<DivisionNode, DivisionFlatNode>;

  checklistSelection: SelectionModel<DivisionFlatNode>;

  removed: DivisionFlatNode[] = [] as DivisionFlatNode[];

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onChange = new EventEmitter();
  @Input() items: Observable<DivisionNode[]>;
  @Input() defaults: SuUserOrgUnits[] = [];
  @Input() disabled: false;

  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<DivisionFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  get selected() {
    return this.checklistSelection == null ? [] : this.checklistSelection.selected;
  }

  checklistChangeSub?: Subscription;
  itemChangeSub?: Subscription;

  ngOnInit() {
    this.itemChangeSub = this.items.subscribe(item => {
      this.removed = [];
      if (this.checklistChangeSub) {
        this.checklistChangeSub.unsubscribe();
      }
      this.checklistSelection = new SelectionModel<DivisionFlatNode>(true /* multiple */);
      this.checklistChangeSub = this.checklistSelection.changed.subscribe(value => {
        value.added.forEach(row => {
          if (row.rowState === undefined || row.rowState !== RowState.Normal) {
            row.rowState = RowState.Add;
            this.onChange.emit();
          } else { this.removed = this.removed.filter(o => o.divCode !== row.divCode); }
        });
        value.removed.forEach(row => {
          if (row.rowState === RowState.Normal) {
            const removed = Object.assign({}, row);
            removed.rowState = RowState.Delete;
            this.onChange.emit();
            this.removed.push(removed);
          }
        });
      });

      this.dataSource.data = this.buildFileTree(item);
      this.treeControl.dataNodes.forEach(row => {
        if (!this.checklistSelection.isSelected(row) && this.defaults.some(o => o.divCode === row.divCode)) {
          this.todoItemSelectionToggle(row);
        }
      });
      this.treeControl.expandAll();
    });
  }

  ngOnDestroy() {
    if (this.itemChangeSub) { this.itemChangeSub.unsubscribe(); }
  }

  buildFileTree(data: DivisionNode[]): DivisionNode[] {
    const idMapping = data.reduce((acc, el, i) => {
      acc[el.divCode] = i;
      return acc;
    }, {});

    const root: DivisionNode[] = [] as DivisionNode[];
    data.forEach(el => {
      // Handle the root element
      if (el.divParent === null) {
        root.push(el);
        return;
      }
      // Use our mapping to locate the parent element in our data array
      const parentEl = data[idMapping[el.divParent]] as DivisionNode;
      // Add our current el to its parent's `children` array
      parentEl.children = [...(parentEl.children || []), el];
    });
    return root;
  }

  getLevel = (node: DivisionFlatNode) => node.level;

  isExpandable = (node: DivisionFlatNode) => node.expandable;

  getChildren = (node: DivisionNode): DivisionNode[] => node.children;

  hasChild = (_: number, nodeData: DivisionFlatNode) => nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: DivisionNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.divCode === node.divCode
      ? existingNode
      : new DivisionFlatNode();
    flatNode.divCode = node.divCode;
    flatNode.divName = node.divName;
    flatNode.ouCode = node.ouCode;
    flatNode.level = level;
    const baseSelected = this.defaults.find(o => o.divCode === node.divCode);
    if (baseSelected) {
      flatNode.userId = baseSelected.userId;
      flatNode.rowVersion = baseSelected.rowVersion;
      flatNode.rowState = RowState.Normal;
    }
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: DivisionFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: DivisionFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: DivisionFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: DivisionFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: DivisionFlatNode): void {
    let parent: DivisionFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: DivisionFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: DivisionFlatNode): DivisionFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
