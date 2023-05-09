# Migrations with RM Panel

## Overview

RM Panel houses its own implementation of MongoDB migrations, routed through `/src/migrations/migrator.js`.

The up-to-date execution of migration scripts is critical for RM Panel to function properly. Neglecting to run migrations may break any data-dependent changes.

Each script that the migrator scans for needs to meet the following conditions or else it (a) won't be found or (b) will be skipped:
1. Must reside in `/src/migrations/scripts`,
2. Must have a `<id>-<epoch>.js` format (`/^([0-9]+)-{1}([0-9]+)(\.js){1}$/`; e.g., `01-1581422011.js`),
3. Must have atleast a `desc` property and `up()` method, and
4. Must not have an epoch timestamp that has not yet passed (no time traveling magic allowed).

## Migration Targeting

The migrator accepts an optional target timestamp in epoch form as the first argument. This timestamp does not have to exactly equal any given migration script's timestamp, but being more specific is better for peace-of-mind.

Here are the possible scenarios:
1. If no target timestamp is specified or if it is `0`, the migrator will execute all `up()` methods.
2. If the target timestamp is _before_ the currentTimestamp stored in the `migrator` collection, the migrator will execute all `down()` methods _from_ the currentTimestamp _down to_ (but not including) the target timestamp.
3. If the target timestamp is _beyond_ the currentTimestamp, the migrator will execute any `up()` methods _inclusively between_ the target timestamp and the currentTimestamp.

## Running Migrations

To run migrations, navigate to the `/src/scripts/` directory and execute this command:

> `./run-migrations.sh [target epoch timestamp]`

Remember that this target epoch timestamp is optional. Refer to the Migration Targeting section above.

## Creating a Migration Script

To create a proper migration script, first refer to the points at the end of the overview to ensure the migrator will find and execute your script.

Refer to the `/src/migrations/scripts/~<id>-<epoch>.js` migration script for an example of how it should look. The contents of this script may serve as a template for your own.