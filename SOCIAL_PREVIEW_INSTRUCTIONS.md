# Generating Social Preview Image

To create the social preview image for better Discord/social media embeds:

## Option 1: Using the Preview Generator (Recommended)

1. Open `public/preview-generator.html` in your browser
2. Take a screenshot or use a tool to capture the page at 1200x630 resolution
3. Save it as `social-preview.png` in the `public` folder

## Option 2: Create Manually

Create a 1200x630 pixel image with:
- **Background**: Gradient from #667eea to #764ba2
- **Title**: "Life Visualizer" (large, bold, white text)
- **Subtitle**: "See Your Life in Weeks"
- **Visual**: Small week grid representation
- **Tagline**: "Visualize • Reflect • Inspire"

## Option 3: Use Existing Heart.png (Temporary)

If you don't have time to create a custom image, you can temporarily use the heart.png by updating the meta tags in index.html to point to `heart.png` instead of `social-preview.png`.

## Tools You Can Use:
- Canva (free templates)
- Figma (free design tool)
- GIMP (free image editor)
- Any screenshot tool + the preview-generator.html

The image should be saved as `public/social-preview.png` for the meta tags to work correctly.
