The contract behind a headless form builder goes beyond a JSON schema.

It also defines which values the server accepts, how files are submitted, how errors reach the UI, and what makes a draft different from a final submission.

I’ve published a new FormFlow guide on that API boundary in Strapi v5.

It covers:

• Public schemas that leave private settings on the server
• Field IDs versus the names used in submission payloads
• JSON and multipart forms using the same field names
• Server-side visibility and validation
• Draft, step and final submission behavior
• Typed errors and renderless React/Vue bindings

A small but important detail: changing a label can preserve the API contract. Changing a field’s submission name requires clients and integrations to be updated.

The guide includes actual FormFlow endpoint, payload and SDK examples, checked against the plugin and SDK source.

Read it here:
https://formflow.digid.ca/blog/guides/headless-form-api-contract

#Strapi #APIDesign #WebDevelopment
