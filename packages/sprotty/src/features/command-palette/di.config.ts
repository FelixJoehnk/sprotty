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
import '@vscode/codicons/dist/codicon.css';
import { ContainerModule } from "inversify";
import { TYPES } from "../../base/types";
import { CommandPaletteActionProviderRegistry } from "./action-providers";
import { CommandPalette, CommandPaletteKeyListener } from "./command-palette";

const commandPaletteModule = new ContainerModule((bind) => {
    bind(CommandPalette).toSelf().inSingletonScope();
    bind(TYPES.IUIExtension).toService(CommandPalette);
    bind(CommandPaletteKeyListener).toSelf().inSingletonScope();
    bind(TYPES.KeyListener).toService(CommandPaletteKeyListener);
    bind(CommandPaletteActionProviderRegistry).toSelf().inSingletonScope();
    bind(TYPES.ICommandPaletteActionProviderRegistry).toService(CommandPaletteActionProviderRegistry);
});

export default commandPaletteModule;
