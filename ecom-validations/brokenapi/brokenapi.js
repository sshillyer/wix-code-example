import * as ecomValidations from 'interfaces-ecommerce-v1-validations-provider';

/**
 * This endpoint retrieves validation violations from your app.
 *
 * Wix calls this endpoint when certain actions are performed on a visitor's cart and checkout. For example, when an item is added to the cart, or when a coupon is added to a checkout.
 * This endpoint validates a visitor's cart and checkout, and returns any validation violations (using the structure provided by Wix eCommerce). Site visitors can see the validation violations in their cart and checkout pages. If there aren't any validation violations, the endpoint returns an object containing an empty list.
 *
 * > __Notes:__
 * > + By default, this endpoint only retrieves validation violations from a visitor's checkout. If you want to also retrieve validation violations from a visitor's cart, set the `validateInCart` parameter to `true` in the Ecom Validations Integration's config file located in the [Wix Developers Center](https://dev.wix.com/). For more information, see the [prerequisites](https://dev.wix.com/api/rest/drafts/validations-integration-spi/introduction#drafts_validations-integration-spi_introduction_prerequisites) section of the introduction.
 * > + You cannot try out this endpoint because it has to be implemented by an app and can have an arbitrary URL. Therefore, ignore the **Authorization** and **POST** sections below as well as the **Try It Out** button.
 * @param {import('interfaces-ecommerce-v1-validations-provider').GetValidationViolationsOptions} options
 * @param {import('interfaces-ecommerce-v1-validations-provider').Context} context
 * @returns {Promise<import('interfaces-ecommerce-v1-validations-provider').GetValidationViolationsResponse | import('interfaces-ecommerce-v1-validations-provider').BusinessError>}
 */
export const getValidationViolations = async (options, context) => {
    console.log("this event never shows up in Developer Tools Event Logs unless I manually run functional test.");
    // Code is simplified to ALWAYS return a violation, based on examples from https://www.wix.com/velo/reference/spis/wix-ecom/ecom-validations/introduction
    const lineItems = options.validationInfo.lineItems;
    let violations = [];

    if (lineItems.length > 0) {
        console.log("Found at least one item, returning a validation error.");
        const source = options.sourceInfo.source;
        const severity = getSourceSeverity(source);
        const description = "This is always going to fail.";
        const target = {
        lineItem: {
            name: 'LINE_ITEM_DEFAULT',
            _id: (lineItems[0]._id)
        }
        };

        const violation = createViolation(severity, target, description);
        violations.push(violation)
    }
    return violations;
};

function createViolation(severity, target, description) {
  return { severity, target, description };
}

function getSourceSeverity(source) {
  if (source === 'CART') {
    return 'WARNING';
  } else {
    return 'ERROR';
  }
}