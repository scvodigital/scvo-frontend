[scvo-router](../README.md) > ["search-template"](../modules/_search_template_.md) > [SearchTemplate](../classes/_search_template_.searchtemplate.md)



# Class: SearchTemplate


Class to construct an Elasticsearch query

## Implements

* [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)
* [IJsonable](../interfaces/_interfaces_.ijsonable.md)

## Index

### Constructors

* [constructor](_search_template_.searchtemplate.md#constructor)


### Properties

* [compiledTemplate](_search_template_.searchtemplate.md#compiledtemplate)
* [index](_search_template_.searchtemplate.md#index)
* [template](_search_template_.searchtemplate.md#template)
* [type](_search_template_.searchtemplate.md#type)


### Methods

* [getBody](_search_template_.searchtemplate.md#getbody)
* [getHead](_search_template_.searchtemplate.md#gethead)
* [getPrimary](_search_template_.searchtemplate.md#getprimary)
* [renderQuery](_search_template_.searchtemplate.md#renderquery)
* [toJSON](_search_template_.searchtemplate.md#tojson)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new SearchTemplate**(searchTemplate: *[ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)*): [SearchTemplate](_search_template_.searchtemplate.md)


*Defined in [search-template.ts:27](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L27)*



Create a search template


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| searchTemplate | [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)   |  - |





**Returns:** [SearchTemplate](_search_template_.searchtemplate.md)

---


## Properties
<a id="compiledtemplate"></a>

### «Private» compiledTemplate

**●  compiledTemplate**:  *`function`*  =  null

*Defined in [search-template.ts:19](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L19)*


#### Type declaration
►(obj: *`any`*, hbs?: *`any`*): `string`



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| obj | `any`   |  - |
| hbs | `any`   |  - |





**Returns:** `string`






___

<a id="index"></a>

###  index

**●  index**:  *`string`*  =  null

*Implementation of [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md).[index](../interfaces/_interfaces_.isearchtemplate.md#index)*

*Defined in [search-template.ts:14](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L14)*





___

<a id="template"></a>

###  template

**●  template**:  *`string`*  =  null

*Implementation of [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md).[template](../interfaces/_interfaces_.isearchtemplate.md#template)*

*Defined in [search-template.ts:16](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L16)*





___

<a id="type"></a>

###  type

**●  type**:  *`string`*  =  null

*Implementation of [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md).[type](../interfaces/_interfaces_.isearchtemplate.md#type)*

*Defined in [search-template.ts:15](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L15)*





___


## Methods
<a id="getbody"></a>

###  getBody

► **getBody**(params: *`any`*): `any`



*Defined in [search-template.ts:72](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L72)*



Get the body part of an msearch query


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `any`   |  The data to pass into the handlebars template |





**Returns:** `any`
A usable query line for an Elasticsearch msearch






___

<a id="gethead"></a>

###  getHead

► **getHead**(): [ISearchHead](../interfaces/_interfaces_.isearchhead.md)



*Defined in [search-template.ts:60](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L60)*



Get the head part of a msearch query




**Returns:** [ISearchHead](../interfaces/_interfaces_.isearchhead.md)
A usable head line for an Elasticsearch msearch






___

<a id="getprimary"></a>

###  getPrimary

► **getPrimary**(params: *`any`*): `any`



*Defined in [search-template.ts:88](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L88)*



Get a standalone query


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `any`   |  The data to pass into the handlebars template |





**Returns:** `any`
A usable Elasticsearch query payload






___

<a id="renderquery"></a>

###  renderQuery

► **renderQuery**(params: *`any`*): `string`



*Defined in [search-template.ts:46](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L46)*



Render the query template to a string of JSON


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| params | `any`   |  The data to pass into the handlebars template |





**Returns:** `string`
A search query rendered as a string of JSON






___

<a id="tojson"></a>

###  toJSON

► **toJSON**(): [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)



*Implementation of [IJsonable](../interfaces/_interfaces_.ijsonable.md).[toJSON](../interfaces/_interfaces_.ijsonable.md#tojson)*

*Defined in [search-template.ts:21](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/search-template.ts#L21)*





**Returns:** [ISearchTemplate](../interfaces/_interfaces_.isearchtemplate.md)





___


