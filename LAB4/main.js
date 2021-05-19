const ROOT_DIR = "images/";
const width = "300px";
// CORS 오류로 로컬 파일 fetch가 안되서 해당 파일을 깃허브에 올린 뒤 사용했습니다ㅠㅠ
const url = 'https://raw.githubusercontent.com/subong0508/cpp-setting/master/products.json';

var cnt = 0;

function removeAllChilds(parent) {
    parent.innerHTML = '';
}

/* 아이템 생성 */
function createItem(parent, json) {
    let box = document.createElement("div");
    let desc = document.createElement("h5");
    desc.innerHTML = "이미지 클릭 후 정보확인";
    let img = document.createElement("img");
    img.setAttribute("src", ROOT_DIR + json.src);
    img.style.width = width;
    box.appendChild(desc);
    box.appendChild(img);
    parent.appendChild(box);
    showDescription(img, json);
}

/* 클릭 시 제목 나타남 */
function showDescription(img, json) {
    img.addEventListener("click", function() {
        img.parentNode.childNodes[0].innerHTML = "[이름: " + json.name + " & 저자: " + json.author + "]";
    });
}

/* JSON, FetchAPI */
function loadNext() {
    const parent = document.getElementById("imageBox");
    fetch(url)
        .then(response => response.json())
        .then(function(arr) {
            const itemCnt = arr.length;
            for(let i=0;i<2;i++) {
                if(cnt < itemCnt) {
                    createItem(parent, arr[cnt]);
                    cnt += 1;
                }  
            }
        });
}

/* Infinite Scroll */
window.addEventListener("load", loadNext);
window.onscroll = () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadNext();
    }
}

/* 카테고리 필터링 */
function filterCategory() {
    document.querySelector("select").onchange = function() {
        const parent = document.getElementById("imageBox");
        removeAllChilds(parent);
        let cat = this.value;
        fetch(url)
            .then(response => response.json())
            .then(function(arr) {
                if(cat == "전체") {
                    cnt = 0;
                    loadNext();
                } else {
                    for(let i=0;i<arr.length;i++) {
                        if(arr[i].publisher == cat) {
                            createItem(parent, arr[i]);
                        }
                    }
                    cnt = arr.length;
                }
            });
    };
}

/* 키워드 필터링 */
function filterKeyword() {
    document.getElementById("keywordButton").onclick = function() {
    const parent = document.getElementById("imageBox");
    removeAllChilds(parent);
    let keyword = document.getElementById("keyword").value;
    fetch(url)
        .then(response => response.json())
        .then(function(arr) {
            for(let i=0;i<arr.length;i++) {
                if(arr[i].name.indexOf(keyword) != -1 & keyword != '') {
                    createItem(parent, arr[i]);
                }
            }
            cnt = arr.length;
        });
    };
}

/* 페이지 원래대로 돌려놓기 */
function resetKeyword() {
    document.getElementById("keywordReset").onclick = function() {
        const parent = document.getElementById("imageBox");
        removeAllChilds(parent);
        cnt = 0;
        loadNext();
    }
}

document.addEventListener("DOMContentLoaded", filterCategory);
document.addEventListener("DOMContentLoaded", filterKeyword);
document.addEventListener("DOMContentLoaded", resetKeyword);
