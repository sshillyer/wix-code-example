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
    console.log('Hello from validation code: ' + new Date().toDateString());
    let violations = [];

    const source = options.sourceInfo.source;
    const severity = source == ecomValidations.Source.CART ? ecomValidations.Severity.WARNING : ecomValidations.Severity.ERROR;

    const gummyStateProhibitedDescription = 'We cannot ship gummies to your state per regulations.';
    const prohibitedGummyStatesByStateCode = ['alaska', 'colorado', 'connecticut', 'hawaii', 'idaho', 'nevada', 'north dakota', 'oregon', 'rhode island', 'vermont', 'washington'];

    const usersStateCode = (options.validationInfo?.shippingAddress?.address?.state)?.toLowerCase();
    console.log("usersStateCode: " + usersStateCode);
    const isUserInProhibitedGummyState = prohibitedGummyStatesByStateCode.includes(usersStateCode);
    console.log("isUserInProhibitedGummyState: " + isUserInProhibitedGummyState);

    const lineItems = options.validationInfo.lineItems;
    const gummyLineItems = [];
    for (let j = 0; j < options.validationInfo.lineItems?.length; j++) {
        if (isGummie(options.validationInfo.lineItems[j].catalogReference?.catalogItemId)) {
            gummyLineItems.push(options.validationInfo.lineItems[j]);
        }
    }
    console.log("gummyLineItems.length: " + gummyLineItems.length);
    if (isUserInProhibitedGummyState && gummyLineItems?.length > 0) {
        console.log("isUserInProhibitedGummyState && gummyLineItems?.length > 0: " + (isUserInProhibitedGummyState && gummyLineItems?.length > 0));
        for (let i = 0; i < gummyLineItems.length; i++) {
            console.log('pushing a violoation');
            const lineItem = gummyLineItems[i];
            violations.push({
                severity,
                target: { lineItem: { name: ecomValidations.NameInLineItem.LINE_ITEM_DEFAULT, _id: lineItem._id } },
                description: gummyStateProhibitedDescription
            });
        }
    }

    return { violations };
};

const isGummie = (catalogItemId) => {
    // IMPORTANT: would be easier if this could lookup and just check against CategoryId from the product, but IDK how to look that up.
    // If you add new Gummie items, you should add the item GUID to the list below
    const gummieCatalogItemIds = [
        '362b1084-060a-49d8-9ba3-e4701d2dac32',
        'eee03e4c-9d2e-453c-a274-facba8810fbb',
        'ea30bf54-ff67-461c-87f3-2236f83c3e23',
        '9522d8ad-c3ac-36df-17c6-62b8671eb209',
    ];
    const isGummieItem = gummieCatalogItemIds.includes(catalogItemId);
    console.log('isGummieItem: ' + isGummieItem);
    return isGummieItem;
    // const isGummie = catalogItemId != undefined && (catalogItemId == gummieCatalogItemId);
    // return isGummie;
}