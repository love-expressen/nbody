const patternCache = {};

export default class Pattern{
  constructor(context, url) {
    this.url = url;
    if(patternCache[url]){
      this.pattern = patternCache[url];
    } else {
      const img = new Image();
      img.src = this.url;
      img.onload = () => {
        const pattern = context.createPattern(img, "repeat");
        console.log("IMAGE LOADED", pattern);
        this.pattern = patternCache[url] = pattern;
      }
    }

  }

  draw(context) {
    if(this.pattern)
      context.fillStyle = this.pattern;
  }
}