# Documentation

Welcome to the documentation of [lomi.](https://lomi.africa), the open-source payment processing platform powering francophone West African businesses. This repository contains the code for the lomi. website, docs, and blog. Everything is built on top of Next.js, Sanity, and Fumadocs.

## Getting started

To start using lomi. for your payment processing needs:

1. Create a lomi. account at [https://dashboard.lomi.africa/signup](https://dashboard.lomi.africa/signup)
2. Integrate lomi. into your application using our API and SDKs
3. Test your integration in our sandbox environment
4. Go live and start making money

For detailed instructions and guides, visit [lomi.africa](https://lomi.africa).

## Contributing

We welcome contributions to improve lomi. and its documentation. If you find any issues or have suggestions, please open an issue or submit a pull request on our [GitHub repository](https://github.com/lomiafrica/lomi./).

For detailed contribution guidelines, see the main [CONTRIBUTING.md](https://github.com/lomiafrica/lomi./blob/master/CONTRIBUTING.md) in the monorepo.

### REST API reference (this app)

The REST section under `content/docs/api/` is **hand-authored MDX** with parity checks against `openapi.json`. See [REST API reference authoring](/core/contributing/api-reference-authoring). After API changes, run `pnpm run api:bootstrap` from `apps/docs` (and edit for clarity).

## Support

Contact [hello@lomi.africa](mailto:hello@lomi.africa) or visit our [support center](https://docs.lomi.africa/support).

## License

This project is licensed under the [MIT License](LICENSE).
