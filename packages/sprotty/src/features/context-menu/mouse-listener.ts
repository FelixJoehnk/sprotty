/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { inject } from "inversify";
import { Action, SelectAction } from "sprotty-protocol/lib/actions";
import { IActionDispatcher } from "../../base/actions/action-dispatcher";
import { IContextMenuServiceProvider, IContextMenuService } from "./context-menu-service";
import { ContextMenuProviderRegistry } from "./menu-providers";
import { MouseListener } from "../../base/views/mouse-tool";
import { TYPES } from "../../base/types";
import { SModelElement } from "../../base/model/smodel";
import { isSelectable, isSelected } from "../select/model";
import { findParentByFeature } from "../../base/model/smodel-utils";

export class ContextMenuMouseListener extends MouseListener {
    @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
    constructor(
        @inject(TYPES.IContextMenuServiceProvider) protected readonly contextMenuService: IContextMenuServiceProvider,
        @inject(TYPES.IContextMenuProviderRegistry) protected readonly menuProvider: ContextMenuProviderRegistry) {
        super();
    }

    contextMenu(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        this.showContextMenu(target, event);
        return [];
    }

    protected async showContextMenu(target: SModelElement, event: MouseEvent): Promise<void> {
        let menuService: IContextMenuService;
        try {
            menuService = await this.contextMenuService();
        } catch (rejected) {
            // IContextMenuService is not bound => do nothing
            return;
        }
        const mousePosition = { x: event.x, y: event.y };
        const root = target.root;
        const id = target.id;
        let isTargetSelected = false;
        const selectableTarget = findParentByFeature(target, isSelectable);
        if (selectableTarget) {
            isTargetSelected = selectableTarget.selected;
            selectableTarget.selected = true;
        }
        const restoreSelection = () => { if (selectableTarget) selectableTarget.selected = isTargetSelected; };

        if (isSelectable(target)) {
            if (isSelected(target)) {
                const menuItems = await this.menuProvider.getItems(target.root, mousePosition);
                menuService.show(menuItems, mousePosition, restoreSelection);
            } else {
                const options = {selectedElementsIDs: [id], deselectedElementsIDs: Array.from(root.index.all().filter(isSelected), (val) => {return val.id;})};
                await this.actionDispatcher.dispatch(SelectAction.create(options));
                const items = await this.menuProvider.getItems(root, mousePosition);
                menuService.show(items, mousePosition);
            }
        }
    }
}
