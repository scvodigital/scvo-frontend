[scvo-router](../README.md) > ["router"](../modules/_router_.md) > [Router](../classes/_router_.router.md)



# Class: Router


Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output

## Index

### Constructors

* [constructor](_router_.router.md#constructor)


### Methods

* [execute](_router_.router.md#execute)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new Router**(routes: *[IRoutes](../interfaces/_interfaces_.iroutes.md)*): [Router](_router_.router.md)


*Defined in [router.ts:20](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/router.ts#L20)*



Create a Router for matching routes and rendering responses


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| routes | [IRoutes](../interfaces/_interfaces_.iroutes.md)   |  The routes and their configurations we are matching against |





**Returns:** [Router](_router_.router.md)

---



## Methods
<a id="execute"></a>

###  execute

► **execute**(uriString: *`string`*): `Promise`.<[IRouteMatch](../interfaces/_interfaces_.iroutematch.md)>



*Defined in [router.ts:52](https://github.com/scvodigital/scvo-router/blob/627f4b0/src/router.ts#L52)*



Execute the route against a URI to get a matched route and rendered responses


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| uriString | `string`   |  The URI to be matched |





**Returns:** `Promise`.<[IRouteMatch](../interfaces/_interfaces_.iroutematch.md)>
The matched route with rendered results






___


