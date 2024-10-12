class MyElement extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement('p');
		wrapper.textContent = "Hello, I'm a Web Component!";
		shadow.appendChild(wrapper);
		const link = document.createElement('a');
		link.href = 'https://www.google.com';
		link.textContent = 'Google';
		shadow.appendChild(link);
	}
}


export default MyElement;
