// Module imports
import * as request from 'request';
import * as Q from 'q';
import { IMenus, IMenuItem } from 'scvo-router';

export function getMenus(domain: string, stripDomains: string[]): Promise<IMenus> {
    return new Promise((resolve, reject) => {
        var domainRegex: RegExp = null;
        if(stripDomains && stripDomains.length > 0){
            stripDomains = stripDomains.map((domain: string) => { return domain.replace(/\./g, '\\.'); });
            var domainRegexString = '((https?)?:\\/\\/)((' + stripDomains.join(')|(') + '))';
            domainRegex = new RegExp(domainRegexString, 'ig');
        }

        getMenuIds(domain).then((menuIds: number[]) => {
            var promises = menuIds.map((menuId: number) => {
                return getMenu(domain, menuId);
            });

            var obs = Q.all(promises).then((menusArray: any[]) => {
                var menus = {};
                menusArray.forEach((menu: any) => {
                    if(menu.slug){
                        menus[menu.slug] = menu.items.map((item) => { return transformWpMenu(item, domainRegex); });
                    }
                });

                resolve(menus);
            }).catch((err) => {
                console.log('ERROR:', err);  
            });
        });
    });
}

function getMenuIds(domain: string): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
        var options = {
            url: `https://${domain}/wp-json/wp-api-menus/v2/menus`,
            json: true,
        };
        request.get(options, (err, resp, body) => {
            if(err){
                return reject(err);
            }
            if(!Array.isArray(body)){
                return reject(new Error('Expected array response but instead got: ' + JSON.stringify(body, null, 4)));
            }
            var menuIds: number[] = [];
            body.forEach((menu: any) => {
                if(menu.term_id){
                    menuIds.push(menu.term_id);
                }
            });
            
            resolve(menuIds);
        });
    });
}

function getMenu(domain: string, menuId: number): Promise<any> {
    return new Promise((resolve, reject) => {
        var options = {
            url: `https://${domain}/wp-json/wp-api-menus/v2/menus/${menuId}`,
            json: true,
        };
        request(options, (err, resp, body) => {
            if(err){
                return reject(err);
            }
            resolve(body);
        });
    });
}

function transformWpMenu(wpMenuItem: IWPMenuItem, domainRegex: RegExp): IMenuItem{
    var children = !wpMenuItem.children ? [] : wpMenuItem.children.map((child) => { return transformWpMenu(child, domainRegex); });
    var metaData = {};

    if(wpMenuItem.meta_data){
        Object.keys(wpMenuItem.meta_data).forEach((key: string) => {
            var value = wpMenuItem.meta_data[key];
            if(Array.isArray(value) && value.length === 1){
                metaData[key] = value[0];
            }else{
                metaData[key] = value;
            }
        });
    }

    var route = metaData['menu-item-route-pattern'] || null;
    var path = wpMenuItem.url;
    if(domainRegex){
        path = path.replace(domainRegex, '');
    }

    var menuItem: IMenuItem = {
        label: wpMenuItem.title,
        path: path,
        route: route,
        children: children,
        metaData: metaData,
    };

    return menuItem;
}

interface IWPMenuItem {
    id: number;
    order: number;
    parent: number;
    title: string;
    url: string;
    attr: string;
    target: string;
    classes: string;
    xfn: string;
    description: string;
    object_id: number;
    object: string;
    object_slug: string;
    type: string;
    type_label: string;
    meta_data: { [key: string]: string[] };
    children: IWPMenuItem[];
}
