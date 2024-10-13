class MyElement extends HTMLElement {
  private wrapper: HTMLParagraphElement;
  private link: HTMLAnchorElement;

  constructor() {
    super();
    this.wrapper = document.createElement("p");
    this.wrapper.textContent = "Hello, I'm a Web Component!";

    this.link = document.createElement("a");
    this.link.href = "https://www.google.com";
    this.link.textContent = "Google";

    this.appendChild(this.wrapper);
    this.appendChild(this.link);
  }

}

export default MyElement;
