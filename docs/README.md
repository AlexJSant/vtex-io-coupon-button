📢 Use this project, [contribute](https://github.com/{OrganizationName}/{AppName}) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

## Coupon Add Button App

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

The **Coupon Add Button App** (installable as `{vendor}.coupon-button`) provides a storefront block that lets shoppers apply a coupon code to the current order form (cart).

The app uses the official VTEX checkout flow (`insertCoupon`) and syncs the returned order form with `vtex.order-manager`, so minicart and cart data stay consistent across the store.

## Configuration

### Step 1: Add the app to your theme dependencies

In your theme's `manifest.json`, add:

```json
{
  "dependencies": {
    "{vendor}.coupon-button": "0.x"
  }
}
```

Replace `{vendor}` with the vendor defined in this app's `manifest.json`.

### Step 2: Declare the block in your theme

Add the `coupon-button` block in the desired template:

```json
{
  "flex-layout.col#promoColumn": {
    "children": ["coupon-button"]
  }
}
```

You can configure block props in JSON or in the Site Editor:

```json
{
  "coupon-button": {
    "props": {
      "label": "Use coupon",
      "couponCode": "SUMMER10"
    }
  }
}
```

> ⚠️ The coupon code must match a valid coupon/promotion in VTEX Admin for the current shopper/cart context.

## Blocks

The app exports one storefront block:

| Block name | Description |
| --- | --- |
| `coupon-button` | Button that applies the configured coupon code to the current order form. |

### `coupon-button` props

These props are available in `store/interfaces.json` (`content.properties`) and in Site Editor:

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `label` | `string` | Button text displayed in the default state. | `"Cupom"` |
| `couponCode` | `string` | Coupon code sent to `insertCoupon`. | `""` |

## Behavior

When the shopper clicks the button:

1. The app calls `insertCoupon` from `vtex.checkout-resources`.
2. The returned order form is synced with `useOrderForm().setOrderForm` from `vtex.order-manager`.
3. The component updates button state for loading, success, invalid coupon, or technical error.

> ℹ️ This block must run inside the VTEX Store Theme tree where `OrderForm` context is available.

## Customization

To customize styles, use CSS Handles as described in [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handle | Description |
| --- | --- |
| `button` | Clickable button element. |
| `container` | Wrapper element around the button. |
| `label` | Inner text element inside the button. |

The `button` handle also supports status modifiers (`idle`, `applying`, `ok`, `fail`) for state-based styling.

## Additional resources

- Technical notes and change history: [`docs/DEVELOPMENTLOG.md`](./DEVELOPMENTLOG.md).

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
