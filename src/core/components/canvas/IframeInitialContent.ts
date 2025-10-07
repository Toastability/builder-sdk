import tailwindStandalone from "./lib/tailwind.min.js?raw";

export const IframeInitialContent: string = `<!doctype html>
<html lang="en" dir="__HTML_DIR__" class="scroll-smooth h-full overflow-y-auto">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
    ${tailwindStandalone}
    </script>
    <style>
    html { height: 100%; overflow:auto; }
    body { height: 100%; }
    .air-highlight{ outline: 1px solid #42a1fc !important; outline-offset: -1px;}
    .air-highlight-multi{ outline: 1px solid #29e503 !important; outline-offset: -1px;}
    body{   -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none;
            -moz-user-select: none;-ms-user-select: none; user-select: none; }
    html{
      -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    /** IMPORTANT: Make fields content editable in SAFARI */
    [contenteditable] {-webkit-user-select: text;user-select: text;}

    html::-webkit-scrollbar { width: 0 !important }
    .aspect-auto{aspect-ratio: auto;}
    .aspect-square{aspect-ratio: 1/1;}
    .aspect-video{aspect-ratio: 16/9;}
    .dragging [data-dnd="leaf"] { pointer-events: none; } .dragging [data-dnd="leaf"] * { pointer-events: none; }
    .dragging [data-dnd="ignore"], .dragging [data-dnd="ignore"] * { pointer-events: none; }
    a{ pointer-events: none !important; }
    [contenteditable="true"], [contenteditable="true"] * { cursor: text !important; }
    [contenteditable="true"] {
        outline: none;
        box-shadow: 0 0 0px 4px rgba(36, 150, 255, 0.2);
        -webkit-user-select: text;
        -moz-user-select: text;
        user-select: text;
    }
    .frame-root .frame-content { height: 100%; }
    [data-drop="yes"] { outline: 2px dashed orange !important; outline-offset: -2px }
    [data-dnd="yes"] { pointer-events: auto !important}
    [data-dnd="no"],[data-block-type="GlobalBlock"],[data-block-type="PartialBlock"] > * { pointer-events: none !important; }
    [data-block-type="GlobalBlock"],[data-block-type="PartialBlock"] { position: relative !important; }
    .partial-overlay { pointer-events: auto !important; }
    [data-dnd-dragged="yes"] { opacity: 0.6; pointer-events: none; }
    [data-dnd-dragged="no"] { opacity: 1; pointer-events: auto !important; }
    [force-show] { display: block !important; }
    [data-cut-block="yes"] { pointer-events: none !important; display: none !important; }
    </style>    
    <style id="highlighted-block">
      [data-highlighted]{
        outline: 1px solid #42a1fc !important; outline-offset: -1px;
      }
    </style>
    <style id="slider-styles">
      [data-slider-track]::-webkit-scrollbar,
      .slider-container::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      [data-slider-track],
      .slider-container {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
        display: flex !important;
        flex-direction: row !important;
      }
      .slider-slide {
        flex-shrink: 0 !important;
        min-width: 100% !important;
        max-width: 100% !important;
      }
      .slider-nav-controls {
        opacity: 1 !important;
      }
    </style>

  </head>
  <body class="font-body antialiased h-full">
    <div class="frame-root h-full"></div>
  </body>
</html>`;
