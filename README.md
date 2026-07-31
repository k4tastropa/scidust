# scidust

Portfolio website for my dearest friend and best 3D designer I know.

## Artwork library

Artwork lives in `public/artwork/<id>/`. Every artwork folder has an editable
`artwork.json` and one or more numbered image files (`1.jpg`, `2.jpg`, etc.).
Images in a folder are displayed in that order as a single artwork or carousel.

To migrate a flat Instagram download in `public/artwork/`, preview the result
first, then explicitly apply it:

```bash
pnpm artwork:organize
pnpm artwork:organize --apply
```

The migration stores the original Instagram metadata beside each image as
`<image>.source.json`, while `artwork.json` is the small, human-editable record
used by the portfolio. New artwork does not need the migration script: create
the next numbered folder, add its numbered images, and add an `artwork.json`.
