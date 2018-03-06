const fs = require('fs');
const pa = require('path');

const dot = require('dot-object');
const chalk = require('chalk');

console.log(chalk.white.bold('#######################'));
console.log(chalk.white.bold('# Route File Upgrader #'));
console.log(chalk.white.bold('#######################'));
console.log('');

var inputs = process.argv.splice(2);

console.log('Found', inputs.length, 'files:', inputs);

inputs.forEach((path) => {
    upgradeFile(path);
});

function upgradeFile(path) {
    console.log('#### Upgrading:', path);
    var oldRoutesJson = fs.readFileSync(path).toString();
    fs.writeFileSync(path + '.bkp', oldRoutesJson);
    var oldRoutes = JSON.parse(oldRoutesJson);
    var routeNames = Object.keys(oldRoutes);

    console.log('File loaded,', routeNames.length, 'routes found');

    var newRoutes = {};

    console.log('Upgrading routes...');
    routeNames.forEach((name) => {
        var oldRoute = oldRoutes[name];
        var newRoute = {
            pattern: oldRoute.pattern,
            metaData: oldRoute.metaData,
            tasks: [ ],
            destination: {
                destinationType: 'handlebars',
                config: oldRoute.layouts
            }
        };
        
        var primaryTask = {
            name: 'primaryResponse',
            taskType: 'elasticsearch',
            config: {
                connectionStringTemplate: oldRoute.elasticsearchConfig.host,
                elasticsearchConfig: {
                    apiVersion: '5.6'
                },
                queryTemplates: {
                    index: oldRoute.primarySearchTemplate.index,
                    type: oldRoute.primarySearchTemplate.type,
                    template: oldRoute.primarySearchTemplate.template
                }
            }
        }

        newRoute.tasks.push(primaryTask);

        if (oldRoute.supplimentarySearchTemplates && Object.keys(oldRoute.supplimentarySearchTemplates).length > 0) {
            var supplimentaryTask = {
                name: 'supplimentaryResponses',
                taskType: 'elasticsearch',
                config: {
                    connectionStringTemplate: oldRoute.elasticsearchConfig.host,
                    elasticsearchConfig: {
                        apiVersion: '5.6'
                    },
                    queryTemplates: []
                }
            }

            Object.keys(oldRoute.supplimentarySearchTemplates).forEach((templateName) => {
                var oldSearchTemplate = oldRoute.supplimentarySearchTemplates[templateName];
                var newSearchTemplate = {
                    name: templateName,
                    index: oldSearchTemplate.index,
                    type: oldSearchTemplate.type,
                    template: oldSearchTemplate.template
                };
                supplimentaryTask.config.queryTemplates.push(newSearchTemplate);
            });

            newRoute.tasks.push(supplimentaryTask);
        }

        newRoutes[name] = newRoute;
    });

    console.log('...Routes upgraded');
    console.log('Writing file');

    var newRoutesJson = JSON.stringify(newRoutes, null, 4);
    fs.writeFileSync(path, newRoutesJson);
}
