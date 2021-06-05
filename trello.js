{
	//selectors
	let cardModal = document.getElementById("modal1");
	let listModal = document.getElementById("modal2");
	let ok = document.getElementById("ok");
	let boardLists = document.getElementById("boardlists");
	let span = document.getElementsByClassName("close")[0];
	let span2 = document.getElementsByClassName("close")[1];
	let currId,tableList = {};
	let localList = localStorage.getItem("localList")? JSON.parse(localStorage.getItem("localList")) : {};
	handleNewList();

	//event listeners
	span.addEventListener('click', hideCardModal);
	span2.addEventListener('click', hideListModal);
	addList.addEventListener('click',showListModal)
	ok.addEventListener('click',newCard)
	ok2.addEventListener('click',newList)

	//functions
	function allowDrop(ev) {
		ev.preventDefault();
	}

	function dragStart(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
	}

	function dropIt(ev) {
		ev.preventDefault();
		let cardID = ev.dataTransfer.getData("text/plain");
		let cardIDEl = document.getElementById(cardID);
		let cardIDParentEl = cardIDEl.parentElement;
		
		let targetListEl = document.getElementById(ev.target.id)
		while(targetListEl && targetListEl.className !== "board-interior" && targetListEl.className != "board-list") {
			targetListEl = targetListEl.parentElement;
		}
		let targetParentEl = targetListEl.parentElement;
		if(targetParentEl.id !== cardIDParentEl.id) {
			targetParentEl.childNodes.forEach(el => {
				if(el.className == "board-interior") {
					let temp;
					localList[cardIDParentEl.id] = localList[cardIDParentEl.id].filter(item => {
						if(item.title == cardID)
							temp = item;
						return item.title != cardID
					});
					localList[el.id].unshift(temp);
					localStorage.setItem("localList", JSON.stringify(localList));
					el.appendChild(cardIDEl);
				}
			})
		}
	}

	function deleteCard(listName, id) {
		document.getElementById(id).remove();
		localList[listName] = localList[listName].filter(el => el.title != id);
		localStorage.setItem("localList",JSON.stringify(localList));
	}
	
	function deleteList(id) {
		document.getElementById(id).parentElement.remove();
		delete localList[id];
		localStorage.setItem("localList",JSON.stringify(localList));
	}

	function showCardModal(id) {
		cardModal.style.display = "block";
		currId = id;
	}

	function hideCardModal() {
		cardModal.style.display = "none";
		document.getElementById('title').value = ''
		document.getElementById('content').value = ''
	}

	function showListModal() {
		listModal.style.display = "block";
	}

	function hideListModal() {
		listModal.style.display = "none";
		document.getElementById('listName').value = ''
	}

	function newCard() {
		let el = document.createElement('div');
		let title = document.getElementById('title').value;
		let listName = document.getElementById('listName').value;
		let content = document.getElementById('content').value;
		if(title!="") {
			let newDiv = createCardDiv(listName,title,content);
			el.innerHTML = newDiv;
			tableList[currId].appendChild(el.firstChild);
			localList[currId].unshift({title: title, content: content})
			localStorage.setItem("localList",JSON.stringify(localList));
			cardModal.style.display = "none";
			document.getElementById('title').value = ''
			document.getElementById('content').value = ''
		}
	}

	function newCardFromLocal(listName, cardContent) {
		let el = document.createElement('div');
		let title = cardContent.title;
		let content = cardContent.content;
		let newDiv = createCardDiv(listName,title,content);
		el.innerHTML = newDiv;
		tableList[listName].prepend(el.firstChild);
	}

	function newList() {
		let listName = document.getElementById('listName').value;
		handleNewList(listName);
	}

	function handleNewList(listName) {
		if(listName != undefined && listName != "") {
			let newDiv = createListDiv(listName)
			let el = document.createElement('div');
			el.innerHTML = newDiv;
			boardLists.appendChild(el.firstChild);
			localList[listName] = [];
			localStorage.setItem("localList",JSON.stringify(localList))
			tableList[listName] = document.getElementById(listName);
			listModal.style.display = "none";
			document.getElementById('listName').value = ''
		}
		else if(listName == undefined) {
			for(let key in localList) {
				let newDiv = createListDiv(key)
				let el = document.createElement('div');
				el.innerHTML = newDiv;
				boardLists.appendChild(el.firstChild);
				tableList[key] = document.getElementById(key);
				listModal.style.display = "none";
				localList[key].forEach(card => {
					newCardFromLocal(key,card);
				})
			}
		}
	}

	function createCardDiv(listName, title, content) {
		return `<div id = ${title} class="card" draggable="true" ondragstart="dragStart(event)">
			<span class="close" id = 'del${listName}' onClick = "deleteCard('${listName}', '${title}')">
				&times;
			</span>
			<p style = "font-weight:bold">
				${title}
			</p>
			${content}
		</div>`;
	}

	function createListDiv(listName) {
		return `<div class="board-list" >
			<div style="display: flex; align-items: center">
				<div class="list-title">${listName}</div>
				<span style="margin-left: auto" class="close" id = 'del${listName}' onClick = "deleteList('${listName}')">&times;</span>
			</div>
			<div class = "board-interior" id=${listName} ondrop="dropIt(event)" ondragover="allowDrop(event)"> </div>
			<button id=${listName}btn class="circle plus" onClick = "showCardModal('${listName}')"></button>
		</div>`;
	}

	window.onclick = function (event) {
		if(event.target == cardModal || event.target == listModal) {
			cardModal.style.display = "none";
			listModal.style.display = "none";
			document.getElementById('listName').value = ''
			document.getElementById('title').value = ''
			document.getElementById('content').value = ''
		}
	}
}