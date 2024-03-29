
// Input fields validation

function validateCredentials() {
	const apiKey = document.querySelector('#apikey').value;
	const apiSecret = document.querySelector('#apisecret').value;

	if (apiKey == '' || apiKey === null) {
		document.querySelector('#apikey').classList.add('is-invalid');
		return false;
	} else {
		document.querySelector('#apikey').classList.remove('is-invalid');
	}

	if (apiSecret == '' || apiSecret === null) {
		document.querySelector('#apisecret').classList.add('is-invalid');
		return false;
	} else {
		document.querySelector('#apisecret').classList.remove('is-invalid');
	}
	return [apiKey, apiSecret];
}

function validateImage(fileName) {
	const allowed_extensions = ["jpg", "png", "jpeg"];
	let file_extension = fileName.split('.').pop().toLowerCase();
	for (let i = 0; i <= allowed_extensions.length; i++) {
		if (allowed_extensions[i] == file_extension) {
			return true;
		}
	}
	return false;
}

function formatString(str) {
	const compactWhitespace = str.split('_').join(' ');
	return capitalizeEveryWord = compactWhitespace.replace(/\b[a-z]/g, char => char.toUpperCase());
}

// The result-field class indicates from whitch field the request is sended

function clearInputs() {
	const submitImages = document.querySelectorAll('.submit-image');
	submitImages.forEach(input => {
		input.addEventListener('click', () => 		
		submitImages.forEach(input => {
			input.classList.remove('result-field');
			input.value = '';
		}));
		document.querySelector("#output").innerHTML = '';
	});
}

document.addEventListener('DOMContentLoaded', () => {
	clearInputs();
});

document.querySelector("#form-auto-tagging").addEventListener("submit", getTags);

function getTags(e) {
	e.preventDefault();
	let apiCredentials = validateCredentials();

	if (!apiCredentials) {
		alert("Put your credentials in provided input fields. If you don't have any you can register here: https://imagga.com/auth/signup/hacker ");
		return;
	}

	let apiKey = apiCredentials[0];
	let apiSecret = apiCredentials[1];

	const fileInput = document.querySelector('#autoTagFileUpload');
	const url = document.querySelector("#autoTagInputURL").value;
	const threshold = document.querySelector("#autoTagThreshold").value;
	const limit = document.querySelector("#autoTagLimit").value;
	const lang = document.querySelector("#autoTagLang").value;
	let imageRequest;
	let output = "";

	let checkFileExt = validateImage(fileInput.value);
	let checkUrlExt = validateImage(url);

	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(apiKey + ":" + apiSecret));
	let formData = new FormData();
	formData.append('image', fileInput.files[0]);

	let imageUrlRequest = new Request(`https://api.imagga.com/v2/tags?image_url=${url}&threshold=${threshold}&limit=${limit}&language=${lang}`, {
		headers: headers
	});

	let imageUploadRequest = new Request(`https://api.imagga.com/v2/tags?threshold=${threshold}&limit=${limit}&language=${lang}`, {
		method: 'POST',
		headers: headers,
		body: formData
	});

	if (url.length == 0 && checkFileExt) {
		imageRequest = imageUploadRequest;
		fileInput.classList.add('result-field');
	}

	if (checkUrlExt) {
		imageRequest = imageUrlRequest;
		document.querySelector('#autoTagInputURL').classList.add('result-field');
	}

	if (checkUrlExt || checkFileExt) {
		document.querySelector("#output").innerHTML = `<div class="lds-dual-ring"></div>`;
		fetch(imageRequest)
			.then(response => {
				if (response.status != 401) {
					document.querySelector('.key-locked').src = 'img/key-unlocked.svg';
				} else {
					document.querySelector('.key-locked').src = 'img/key-locked.svg';
				}
				if (response.status != 200) {
					document.querySelector("#output").innerHTML =
						`<div class="card border-danger mb-3">
								<div class="card-header">Server error message</div>
								<div class="card-body">
								<p class="card-text">${response.status} ${response.statusText}</p>
								</div>
							</div>`;
					throw Error(response.statusText);
				} else {
					return response.json();
				}
			})
			.then(data => {
				if (data.result.tags.length === 0) {
					output += "No results! Try to decrease the percentage of confidence ";
				} else {
					for (let i = 0; i < data.result.tags.length; i++) {
						let result = data.result.tags[i];
						let resultTag = result.tag[lang];
						let resultConfidence = Math.round(result.confidence);
						output +=
							`<div class="results col-md-8 mx-auto">
								<div class="bs-component">
									<ul class="list-group">              
										<li class="list-group-item d-flex justify-content-between align-items-center">
											${resultTag} 
											<span class="badge badge-primary badge-pill">
												${resultConfidence} %
											</span>
										</li>
									</ul>
								</div>
							</div>`;
					}
				}
				document.querySelector("#output").innerHTML = output;
			})
			.catch(err => console.log(err));
	} else {
		alert("Insert URL or Upload file. Allowed images are .jpg, .jpeg and .png");
	}
}

document.querySelector("#form-categorizer").addEventListener("submit", getCategory);

function getCategory(e) {
	e.preventDefault();

	let apiCredentials = validateCredentials();

	if (!apiCredentials) {
		alert("Put your credentials in provided input fields. If you don't have any you can register here: https://imagga.com/auth/signup/hacker ");
		return;
	}

	let apiKey = apiCredentials[0];
	let apiSecret = apiCredentials[1];

	const fileInput = document.querySelector('#categoryFileUpload');
	const url = document.querySelector("#categoryInputURL").value;
	const lang = document.querySelector("#categoryLang").value;
	let imageRequest;
	let output = "";

	let checkFileExt = validateImage(fileInput.value);
	let checkUrlExt = validateImage(url);

	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(apiKey + ":" + apiSecret));
	let formData = new FormData();
	formData.append('image', fileInput.files[0]);

	let imageUrlRequest = new Request(`https://api.imagga.com/v2/categories/personal_photos?image_url=${url}&language=${lang}`, {
		headers: headers
	});

	let imageUploadRequest = new Request(`https://api.imagga.com/v2/categories/personal_photos?language=${lang}`, {
		method: 'POST',
		headers: headers,
		body: formData
	});

	if (url.length == 0 && checkFileExt) {
		imageRequest = imageUploadRequest;
		fileInput.classList.add('result-field');
	}

	if (checkUrlExt) {
		imageRequest = imageUrlRequest;
		document.querySelector('#categoryInputURL').classList.add('result-field');
	}

	if (checkUrlExt || checkFileExt) {
		document.querySelector("#output").innerHTML = `<div class="lds-dual-ring"></div>`;
		fetch(imageRequest)
			.then(response => {
				if(response.status != 401) {
					document.querySelector('.key-locked').src = 'img/key-unlocked.svg';
				} else {
					document.querySelector('.key-locked').src = 'img/key-locked.svg';
				}
				if (response.status != 200) {
					document.querySelector("#output").innerHTML =
						`<div class="card border-danger mb-3">
								<div class="card-header">Server error message</div>
								<div class="card-body">
								<p class="card-text">${response.status} ${response.statusText}</p>
								</div>
							</div>`;
					throw Error(response.statusText);
				} else {
					return response.json();
				}
			})
			.then(data => {
				if (data.result.categories.length === 0) {
					output += "No categories found";
				} else {
					for (let i = 0; i < data.result.categories.length; i++) {
						let result = data.result.categories[i];
						let resultCategory = result.name[lang];
						let resultConfidence = Math.round(result.confidence);
						output +=
							`<div class="results col-md-8 mx-auto">
								<div class="bs-component">
									<ul class="list-group">              
										<li class="list-group-item d-flex justify-content-between align-items-center">
											${resultCategory} 
											<span class="badge badge-primary badge-pill">
												${resultConfidence} %
											</span>
										</li>
									</ul>
								</div>
							</div>`;
					}
				}
				document.querySelector("#output").innerHTML = output;
			})
			.catch(err => console.log(err));
	} else {
		alert("Insert URL or Upload file. Allowed images are .jpg, .jpeg and .png");
	}
}

document.querySelector("#form-colors").addEventListener("submit", getColors);

function getColors(e) {
	e.preventDefault();

	let apiCredentials = validateCredentials();

	if (!apiCredentials) {
		alert("Put your credentials in provided input fields. If you don't have any you can register here: https://imagga.com/auth/signup/hacker ");
		return;
	}

	let apiKey = apiCredentials[0];
	let apiSecret = apiCredentials[1];

	const fileInput = document.querySelector('#colorsFileUpload');
	const url = document.querySelector("#colorsInputURL").value;
	let imageRequest;
	let output = "";

	let checkFileExt = validateImage(fileInput.value);
	let checkUrlExt = validateImage(url);

	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(apiKey + ":" + apiSecret));

	let formData = new FormData();
	formData.append('image', fileInput.files[0]);

	let imageUrlRequest = new Request(`https://api.imagga.com/v2/colors?image_url=${url}`, {
		headers: headers
	});

	let imageUploadRequest = new Request(`https://api.imagga.com/v2/colors`, {
		method: 'POST',
		headers: headers,
		body: formData
	});

	if (url.length == 0 && checkFileExt) {
		imageRequest = imageUploadRequest;
		fileInput.classList.add('result-field');
	}

	if (checkUrlExt) {
		imageRequest = imageUrlRequest;
		document.querySelector('#colorsInputURL').classList.add('result-field');
	}

	if (checkUrlExt || checkFileExt) {
		document.querySelector("#output").innerHTML = `<div class="lds-dual-ring"></div>`;
		fetch(imageRequest)
			.then(response => {
				if(response.status != 401) {
					document.querySelector('.key-locked').src = 'img/key-unlocked.svg';
				} else {
					document.querySelector('.key-locked').src = 'img/key-locked.svg';
				}
				if (response.status != 200) {
					document.querySelector("#output").innerHTML =
						`<div class="card border-danger mb-3">
							<div class="card-header">Server error message</div>
							<div class="card-body">
								<p class="card-text">${response.status} ${response.statusText}</p>
							</div>
						</div>`;
					throw Error(response.statusText);
				} else {
					// document.querySelector('.key-unlocked').src = 'img/key-locked.svg';
					return response.json();
				}
			})
			.then(data => {
				let obj = data.result.colors;
				let bgHeader = formatString(Object.keys(data.result.colors)[0]);
				let fgHeader = formatString(Object.keys(data.result.colors)[3]);
				let imgHeader = formatString(Object.keys(data.result.colors)[4]);
				let bgColorslen = Object.keys(obj["background_colors"]).length;
				let fgColorslen = Object.keys(obj["foreground_colors"]).length;
				let imgColorslen = Object.keys(obj["image_colors"]).length;
				output =
					`<div class="accordion" id="accordionExample">   
	         				<div class="card">
	              				<div class="card-header" id="headingOne">
	                				<h5 class="mb-0">
	                  					<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
	                    					${bgHeader}
	                  					</button>
	                				</h5>
	              				</div>
	            				<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">`;
				if (bgColorslen > 0) {
					output += `
									<div class="card-body">
										<div class="bar-graph">
											<div class="graph">
												<ul class="grid">
													<li><!-- 100% --></li>
													<li></li>
													<li></li>
													<li></li>
													<li></li>
												</ul>
												<ul>`;
					for (let i = 0; i < bgColorslen; i++) {
						let colorName = obj["background_colors"][i].closest_palette_color;
						let colorHtmlCode = obj["background_colors"][i].closest_palette_color_html_code;
						let colorPercent = Math.round(obj["background_colors"][i].percent);
						// <!-- 200px = 100% -->
						let barHeight = Math.round((colorPercent * 200) / 100);
						output +=
							`<li class="bar nr-${[i]}" style="height: ${barHeight}px; background-color: ${colorHtmlCode};">
														<div class="bottom">${colorName}</div>
															<span>${colorPercent}%</span>
													</li>`;
					}
					output += `
												</ul> 
											</div>
										</div>
									</div>
								</div>
							</div>`;
				} else {
					output +=
						'<ul class="list-group">\n                                    <li class="list-group-item d-flex justify-content-between align-items-center">\n                                        ' + bgHeader + ' not found\n                                    </li>\n                                </ul>\n                            </div>\n                        </div> ';
				}
				output +=
					`<div class="card">
							<div class="card-header" id="headingTwo">
								<h5 class="mb-0">
									<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
										${fgHeader}
									</button>
								</h5>
							</div>
							<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">`;
				if (fgColorslen > 0) {
					output +=
						`<div class="card-body">
									<div class="bar-graph">
										<div class="graph">
											<ul class="grid">
												<li><!-- 100% --></li>
												<li></li>
												<li></li>
												<li></li>
												<li></li>
											</ul>
											<ul>`;
					for (let i = 0; i < fgColorslen; i++) {
						let colorName = obj["foreground_colors"][i].closest_palette_color;
						let colorHtmlCode = obj["foreground_colors"][i].closest_palette_color_html_code;
						let colorPercent = Math.round(obj["foreground_colors"][i].percent);
						// <!-- 200px = 100% -->
						let barHeight = Math.round((colorPercent * 200) / 100);
						output +=
							`<li class="bar nr-${[i]}" style="height: ${barHeight}px; background-color: ${colorHtmlCode};">
													<div class="bottom">${colorName}</div>
													<span>${colorPercent}%</span>
												</li>`;
					}
					output += `
											</ul> 
										</div>
									</div>
								</div>
							</div>
						</div>`;
				} else {
					output +=
						`<ul class="list-group">
									<li class="list-group-item d-flex justify-content-between align-items-center">
										${fgHeader} not found
									</li>
								</ul> 
							</div>
						</div>`;
				}
				output +=
					`<div class="card">
							<div class="card-header" id="headingThree">
								<h5 class="mb-0">
									<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
									${imgHeader}
									</button>
								</h5>
							</div>
							<div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">`;
				if (imgColorslen > 0) {
					output +=
						`<div class="card-body">
									<div class="bar-graph">
										<div class="graph">
											<ul class="grid">
												<li><!-- 100% --></li>
												<li></li>
												<li></li>
												<li></li>
												<li></li>
											</ul>
											<ul>`;

					for (let i = 0; i < imgColorslen; i++) {
						let colorName = obj["image_colors"][i].closest_palette_color;
						let colorHtmlCode = obj["image_colors"][i].closest_palette_color_html_code;
						let colorPercent = Math.round(obj["image_colors"][i].percent);
						// <!-- 200px = 100% -->
						let barHeight = Math.round((colorPercent * 200) / 100);
						output +=
							`<li class="bar nr-${[i]}" style="height: ${barHeight}px; background-color: ${colorHtmlCode};">
													<div class="bottom">${colorName}</div>
													<span>${colorPercent}%</span>
												</li>`;
					}
					output +=
						`</ul> 
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>`;
				} else {
					output +=
						`<ul class="list-group">
								<li class="list-group-item d-flex justify-content-between align-items-center">
									${imgHeader} not found
								</li>
							</ul>`;
				}
				document.querySelector("#output").innerHTML = output;
			})
			.catch(err => console.log(err));
	} else {
		alert("Insert URL or Upload file. Allowed images are .jpg, .jpeg and .png");
	}
}


// Cookie Consent

window.onload = function () {
	const bannerConsent = document.querySelector(".banner-consent");
	const acceptCookie = document.querySelector(".accept-cookie");

	if (!getCookie("acceptCookie")) {
		bannerConsent.classList.add("show");
	}

	acceptCookie.addEventListener("click", function () {
		setCookie("acceptCookie", true, 1);
		bannerConsent.classList.remove("show");
	});

	// Cookie functions from w3schools
	function setCookie(cname, cvalue, exdays) {
		let d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		let expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
};
