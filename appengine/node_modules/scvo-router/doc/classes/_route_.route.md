[scvo-router](../README.md) > ["route"](../modules/_route_.md) > [Route](../classes/_route_.route.md)



# Class: Route


Class that handles a route match, implements search templates and gets results

## Implements

* [IRoute](../interfaces/_interfaces_.iroute.md)
* [IJsonable](../interfaces/_interfaces_.ijsonable.md)

## Index

### Constructors

* [constructor](_route_.route.md#constructor)


### Properties

* [elasticsearchConfig](_route_.route.md#elasticsearchconfig)
* [linkTags](_route_.route.md#linktags)
* [metaTags](_route_.route.md#metatags)
* [name](_route_.route.md#name)
* [pattern](_route_.route.md#pattern)
* [primarySearchTemplate](_route_.route.md#primarysearchtemplate)
* [queryDelimiter](_route_.route.md#querydelimiter)
* [queryEquals](_route_.route.md#queryequals)
* [supplimentarySearchTemplates](_route_.route.md#supplimentarysearchtemplates)
* [template](_route_.route.md#template)


### Methods

* [toJSON](_route_.route.md#tojson)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new Route**(route?: *[IRoute](../interfaces/_interfaces_.iroute.md)*): [Route](_route_.route.md)


*Defined in [route.ts:41](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L41)*



Create a Route


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| route | [IRoute](../interfaces/_interfaces_.iroute.md)  |  null |   - |





**Returns:** [Route](_route_.route.md)

---


## Properties
<a id="elasticsearchconfig"></a>

###  elasticsearchConfig

**●  elasticsearchConfig**:  *`ConfigOptions`*  =  null

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[elasticsearchConfig](../interfaces/_interfaces_.iroute.md#elasticsearchconfig)*

*Defined in [route.ts:25](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L25)*





___

<a id="linktags"></a>

###  linkTags

**●  linkTags**:  *[ILinkTag](../interfaces/_interfaces_.ilinktag.md)[]*  =  null

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[linkTags](../interfaces/_interfaces_.iroute.md#linktags)*

*Defined in [route.ts:12](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L12)*





___

<a id="metatags"></a>

###  metaTags

**●  metaTags**:  *[IMetaTag](../interfaces/_interfaces_.imetatag.md)[]*  =  null

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[metaTags](../interfaces/_interfaces_.iroute.md#metatags)*

*Defined in [route.ts:13](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L13)*





___

<a id="name"></a>

###  name

**●  name**:  *`string`*  = "_default"

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[name](../interfaces/_interfaces_.iroute.md#name)*

*Defined in [route.ts:11](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L11)*





___

<a id="pattern"></a>

###  pattern

**●  pattern**:  *`string`*  = ""

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[pattern](../interfaces/_interfaces_.iroute.md#pattern)*

*Defined in [route.ts:14](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L14)*





___

<a id="primarysearchtemplate"></a>

###  primarySearchTemplate

**●  primarySearchTemplate**:  *[SearchTemplate](_search_template_.searchtemplate.md)*  =  null

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[primarySearchTemplate](../interfaces/_interfaces_.iroute.md#primarysearchtemplate)*

*Defined in [route.ts:23](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L23)*





___

<a id="querydelimiter"></a>

###  queryDelimiter

**●  queryDelimiter**:  *`string`*  = "&"

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[queryDelimiter](../interfaces/_interfaces_.iroute.md#querydelimiter)*

*Defined in [route.ts:15](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L15)*





___

<a id="queryequals"></a>

###  queryEquals

**●  queryEquals**:  *`string`*  = "="

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[queryEquals](../interfaces/_interfaces_.iroute.md#queryequals)*

*Defined in [route.ts:16](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L16)*





___

<a id="supplimentarysearchtemplates"></a>

###  supplimentarySearchTemplates

**●  supplimentarySearchTemplates**:  *[ISearchTemplateSet](../interfaces/_interfaces_.isearchtemplateset.md)* 

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[supplimentarySearchTemplates](../interfaces/_interfaces_.iroute.md#supplimentarysearchtemplates)*

*Defined in [route.ts:24](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L24)*





___

<a id="template"></a>

###  template

**●  template**:  *`string`*  =  `
        {{#and primaryResultSet primaryResultSet.documents}}
            {{#forEach primaryResultSet.documents}}
                {{{_view}}}
            {{/forEach}}
        {{/and}}`

*Implementation of [IRoute](../interfaces/_interfaces_.iroute.md).[template](../interfaces/_interfaces_.iroute.md#template)*

*Defined in [route.ts:17](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L17)*





___


## Methods
<a id="tojson"></a>

###  toJSON

► **toJSON**(): [IRoute](../interfaces/_interfaces_.iroute.md)



*Implementation of [IJsonable](../interfaces/_interfaces_.ijsonable.md).[toJSON](../interfaces/_interfaces_.ijsonable.md#tojson)*

*Defined in [route.ts:27](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/route.ts#L27)*





**Returns:** [IRoute](../interfaces/_interfaces_.iroute.md)





___


