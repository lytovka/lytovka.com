class ImageCarousel extends HTMLElement {
  private numberOfItems: number;

  constructor() {
    super();
    this.numberOfItems = this.children.length;
    // check that all children are of image type
    const allImages = [...this.children].every(
      (child) => child.tagName === "IMG",
    );
    if (!allImages) {
      throw new Error("All children must be of type <img>");
    }
    const slides = [...this.children];

    // wrapper
    this.innerHTML = this.createCarouselWrapper();

    const carousel = this.querySelector(".carousel-wrapper");
    if (!carousel) return;

    // slides
    slides.forEach((image, index) => {
      console.log(image);
      const slide = document.createElement("div");
      slide.setAttribute("id", `slide-${index}`);
      slide.setAttribute("aria-hidden", "true");
      slide.setAttribute("tabindex", "-1");
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute(
        "aria-label",
        `Slide ${index + 1} of ${this.numberOfItems}`,
      );
      const slideTitleTag = document.createElement("h2");
      slideTitleTag.id = `item-${index}-heading`;
      slideTitleTag.textContent = image.getAttribute("alt") || `Slide ${index}`;
      slide.setAttribute("style", image.getAttribute("style") || "");
      slide.appendChild(image);
      slide.appendChild(slideTitleTag);

      carousel.appendChild(slide);
    });

    // controls
    const controlWrapper = document.createElement("div");
    controlWrapper.setAttribute("role", "group");
    controlWrapper.setAttribute("aria-label", "Slide controls");

    const buttonLeft = document.createElement("button");
    buttonLeft.textContent = "Previous slide";
    const buttonRight = document.createElement("button");
    buttonRight.textContent = "Next slide";

    controlWrapper.appendChild(buttonLeft);
    controlWrapper.appendChild(buttonRight);

    carousel.appendChild(controlWrapper);
  }

  connectedCallback() {
    console.log("connected", this.numberOfItems);
  }

  createCarouselWrapper() {
    return `<div aria-label="Carousel" role="region" class="carousel-wrapper"></div>`;
  }
}

customElements.define("image-carousel", ImageCarousel);

export default ImageCarousel;
