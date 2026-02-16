<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/logo-light.png">
    <img alt="strapi-plugin-rrule logo" src="assets/logo-light.png" width="300">
  </picture>
</p>

<h1 align="center">strapi-plugin-rrule</h1>

<p align="center">A Strapi v5 custom field plugin for managing recurrence rules (RFC 5545) for events and schedules.</p>

## Features

- Custom field for defining recurrence rules using the [RRule standard](https://datatracker.ietf.org/doc/html/rfc5545)
- Supports daily, weekly, monthly, and yearly frequencies
- Configurable end conditions (count, until date, or never)
- Weekday selection for weekly rules
- Monthly options (by day of month or by weekday position)
- Live preview of upcoming occurrences
- Stored as JSON for easy server-side processing

## Installation

```bash
npm install @opkod-france/strapi-plugin-rrule
```

## Usage

1. Install the plugin in your Strapi v5 project
2. In the Content-Type Builder, add a new **Custom** field
3. Select **Recurrence Rule** from the list
4. Configure the field options as needed

## License

MIT
