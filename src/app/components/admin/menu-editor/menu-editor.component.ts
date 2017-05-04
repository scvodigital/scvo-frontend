import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import { MaterializeDirective, MaterializeAction } from "angular2-materialize";

import { AppService, MenuElement } from '../../../services/app.service';
import { SiteComponent } from '../../../common/base.component';

@Component({
    selector: 'app-menu-editor',
    templateUrl: './menu-editor.component.html'
})
export class MenuEditorComponent extends SiteComponent {
    menuName: string = 'Loading menu';
    get items(): MenuElement[] {
        if (!this.menuName || !this.appService.allMenus.hasOwnProperty(this.menuName)) {
            return [];
        } else {
            return this.appService.allMenus[this.menuName];
        }
    }

    get roles(): string[] {
        if (!this.appService || !this.appService.config) {
            return [];
        } else {
            return ['all', 'authenticated', 'unauthenticated'];//.concat(this.appService.config.roles);
        }
    }

    constructor(appService: AppService, private route: ActivatedRoute) { super(appService); }

    onSiteLoaded() {
        this.route.params.subscribe(params => {
            this.menuName = params['id'];
        });
    }

    save() {
        this.appService.saveMenu().then(() => {
            console.log('Saved menu');
            // this.modalEditActions.emit({ action: 'toast', params: ['Menu updated', 4000, 'green white-text'] });
        }).catch((err) => {
            console.error('Error saving menu', err);
        });
    }

    // modalDeleteActions = new EventEmitter<string | MaterializeAction>();
    // modalEditActions = new EventEmitter<string | MaterializeAction>();
    selectedItem: number = null;
    showDeleteMenuItem(i) {
        this.selectedItem = i;
        // this.modalDeleteActions.emit({ action: "modal", params: ['open'] });
    }

    deleteMenuItem() {
        if (this.selectedItem !== null && this.items.length >= this.selectedItem) {
            this.items.splice(this.selectedItem, 1);
            this.save();
        }
        this.closeDeleteModal();
    }

    closeDeleteModal() {
        this.selectedItem = null;
        // this.modalDeleteActions.emit({ action: 'modal', params: ['close'] });
    }

    editCreate: string = 'Create';
    selectedItemPath: string = '';
    selectedItemRoles: string[] = [];
    showEditMenuItem(i) {
        if (i === -1) {
            this.selectedItem = null;
            this.editCreate = 'Create';
            this.selectedItemPath = '/';
            this.selectedItemRoles = ['unauthenticated', 'all'];
        } else {
            this.selectedItem = i;
            this.editCreate = 'Edit';
            this.selectedItemPath = this.items[this.selectedItem].name;
            this.selectedItemRoles = this.items[this.selectedItem].roles;
        }
        // this.modalEditActions.emit({ action: "modal", params: ['open'] });
    }

    closeEditModal() {
        this.selectedItem = null;
        // this.modalEditActions.emit({ action: 'modal', params: ['close'] });
    }

    saveMenuItem() {
        var path = this.selectedItemPath.replace(/\//g, '_');
        var newItem = new MenuElement(path, this.selectedItemRoles, []);
        if (this.selectedItem === null) {
            this.items.push(newItem);
        } else if (this.items.length >= this.selectedItem) {
            this.items.splice(this.selectedItem, 1, newItem);
        }
        this.save();
        this.closeEditModal();
    }
}
