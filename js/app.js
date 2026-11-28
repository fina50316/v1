// KIWI TRAILS 行程規劃：前端展示版（資料暫存於 localStorage）
// 正式上線時，請將 load/save 部分改接 PHP + MySQL API。

const FAVORITES = [
  {id:1,name:"Skyline Queenstown",city:"Queenstown",description:"搭乘纜車欣賞皇后鎮與瓦卡蒂普湖景色",lat:-45.0312,lng:168.6626,image:"https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=500"},
  {id:2,name:"Queenstown Gardens",city:"Queenstown",description:"湖畔散步與欣賞群山風景",lat:-45.0347,lng:168.6668,image:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500"},
  {id:3,name:"Christchurch Gondola",city:"Christchurch",description:"從高處俯瞰城市與坎特伯雷平原",lat:-43.5781,lng:172.7008,image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500"},
  {id:4,name:"Shamarra Alpacas",city:"Akaroa",description:"近距離認識羊駝，欣賞海港風光",lat:-43.8108,lng:172.9582,image:"https://images.unsplash.com/photo-1516467508483-a7212fxbe31?w=500"},
  {id:5,name:"Te Anau Glowworm Caves",city:"Te Anau",description:"搭船探索神奇的螢火蟲洞穴",lat:-45.4167,lng:167.7167,image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500"},
  {id:6,name:"Milford Sound",city:"Fiordland",description:"搭船欣賞峽灣、瀑布與壯麗山壁",lat:-44.6414,lng:167.8974,image:"https://images.unsplash.com/photo-1469521669194-babee45599def?w=500"},
  {id:7,name:"Hobbiton Movie Set",city:"Matamata",description:"走進電影場景，探索綠龍酒館與哈比屋",lat:-37.8721,lng:175.6829,image:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=500"},
  {id:8,name:"Waitomo Glowworm Caves",city:"Waitomo",description:"搭船欣賞洞穴內閃爍的藍色螢光",lat:-38.2606,lng:175.1032,image:"https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500"},
  {id:9,name:"Wellington Cable Car",city:"Wellington",description:"搭乘紅色纜車前往植物園與觀景點",lat:-41.2853,lng:174.7678,image:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500"},
  {id:10,name:"Sky Tower",city:"Auckland",description:"從高空觀景台俯瞰奧克蘭市區",lat:-36.8485,lng:174.7622,image:"https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500"}
];

const $ = id => document.getElementById(id);
const today = new Date();
const dateISO = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const dateText = value => new Date(value+"T00:00:00").toLocaleDateString("zh-TW",{month:"numeric",day:"numeric",weekday:"short"});
const addDays = (value,n) => { const d=new Date(value+"T00:00:00"); d.setDate(d.getDate()+n); return dateISO(d); };
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function makeTrip(name,startDate,days){
  return {id:crypto.randomUUID(),name,startDate,days:Array.from({length:days},(_,i)=>({date:addDays(startDate,i),items:[]}))};
}
let saved = null;
try { saved = JSON.parse(localStorage.getItem("kiwiTrailsTrips")); } catch(e) {}
let trips = Array.isArray(saved)&&saved.length ? saved : [makeTrip("南島探索之旅",dateISO(today),5)];
let currentTripId = trips[0].id;
let selectedDayIndex = 0;
let editingTripId = null;
let selectedFavoriteIds = new Set();
let showRoute = false;
let draggedItemId = null;
let map = null;
let directionsService = null;
let directionsRenderer = null;
let markers = [];
let mapReady = false;

function showMapMessage(message) {
  const mapBox = document.getElementById("map");
  if (mapBox) mapBox.innerHTML = '<div class="map-message">' + escapeHTML(message) + '</div>';
}

function loadGoogleMaps() {
  const key = window.GOOGLE_MAPS_API_KEY;
  if (!key || key === "YOUR_GOOGLE_MAPS_API_KEY") {
    showMapMessage("尚未設定 Google Maps API Key。請在 js/google-maps-config.js 填入自己的金鑰，並確認已啟用 Maps JavaScript API 與 Directions API。");
    return;
  }
  window.initKiwiGoogleMap = () => {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -43.8, lng: 170.5 },
      zoom: 5,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeId: "roadmap"
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#347fd1", strokeWeight: 5, strokeOpacity: .88 }
    });
    mapReady = true;
    renderMap();
  };
  const script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key) + "&callback=initKiwiGoogleMap&language=zh-TW&region=NZ";
  script.async = true;
  script.defer = true;
  script.onerror = () => showMapMessage("Google Maps 載入失敗，請檢查 API Key、網路連線與 API 啟用狀態。");
  document.head.appendChild(script);
}


function persist(){ localStorage.setItem("kiwiTrailsTrips",JSON.stringify(trips)); }
function currentTrip(){ return trips.find(t=>t.id===currentTripId); }
function currentDay(){ return currentTrip().days[selectedDayIndex]; }
function favorite(id){ return FAVORITES.find(f=>f.id===Number(id)); }

function render(){
  const trip=currentTrip();
  if(!trip) return;
  selectedDayIndex=Math.min(selectedDayIndex,trip.days.length-1);
  $("tripList").innerHTML=trips.map(t=>`<button class="trip-item ${t.id===currentTripId?"active":""}" data-trip="${t.id}"><span class="trip-symbol">✈</span><span><strong>${escapeHTML(t.name)}</strong><small>${t.days.length} 天・${dateText(t.days[0].date)}</small></span></button>`).join("");
  $("currentTripName").textContent=trip.name;
  $("tripMeta").textContent=`${dateText(trip.days[0].date)} 出發　・　${dateText(trip.days[trip.days.length-1].date)} 結束`;
  $("tripDayCount").textContent=trip.days.length;
  $("dayTabs").innerHTML=trip.days.map((d,i)=>`<button class="day-tab ${i===selectedDayIndex?"active":""}" data-day="${i}"><strong>第 ${String(i+1).padStart(2,"0")} 天</strong><small>${dateText(d.date)}</small></button>`).join("");
  const day=currentDay();
  $("selectedDayKicker").textContent=`DAY ${String(selectedDayIndex+1).padStart(2,"0")}`;
  $("selectedDateTitle").textContent=`${dateText(day.date)} 行程`;
  $("attractionList").innerHTML=day.items.map((item,i)=>{
    const f=favorite(item.favoriteId); if(!f)return "";
    return `<article class="attraction-card" draggable="true" data-item="${item.id}">
      <span class="drag-handle" title="拖曳排序">⠿</span><img class="attraction-thumb" src="${f.image}" alt="${escapeHTML(f.name)}" onerror="this.style.visibility='hidden'">
      <div class="attraction-info"><h4>${escapeHTML(f.name)}</h4><p>${escapeHTML(f.description)}</p><span class="city-chip">⌖ ${escapeHTML(f.city)}</span></div>
      <div class="card-actions"><button class="mini-btn" data-move="-1" data-id="${item.id}" title="往上移" ${i===0?"disabled":""}>↑</button><button class="mini-btn" data-move="1" data-id="${item.id}" title="往下移" ${i===day.items.length-1?"disabled":""}>↓</button><button class="mini-btn remove" data-remove="${item.id}" title="移除此景點">×</button></div>
    </article>`;
  }).join("");
  $("emptyDay").classList.toggle("hidden",day.items.length>0);
  $("attractionList").classList.toggle("hidden",day.items.length===0);
  $("mapCount").textContent=`目前 ${day.items.length} 個景點`;
  renderMap();
  requestAnimationFrame(() => map.invalidateSize());
}

function renderMap(){
  if (!mapReady || !map) return;
  markers.forEach(marker => marker.setMap(null));
  markers = [];
  directionsRenderer.set("directions", null);
  const items = currentDay().items.map(i => favorite(i.favoriteId)).filter(Boolean);
  const bounds = new google.maps.LatLngBounds();

  items.forEach((f, i) => {
    const position = { lat: Number(f.lat), lng: Number(f.lng) };
    const marker = new google.maps.Marker({
      position,
      map,
      title: f.name,
      label: { text: String(i + 1), color: "#ffffff", fontWeight: "700" },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: "#4f8f4a",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3
      }
    });
    const info = new google.maps.InfoWindow({
      content: '<div class="map-popup"><strong>' + escapeHTML(f.name) + '</strong><br>' + escapeHTML(f.city) + '</div>'
    });
    marker.addListener("click", () => info.open({ anchor: marker, map }));
    markers.push(marker);
    bounds.extend(position);
  });

  if (items.length === 1) {
    map.setCenter(bounds.getCenter());
    map.setZoom(11);
  } else if (items.length > 1) {
    map.fitBounds(bounds, 48);
  } else {
    map.setCenter({ lat: -43.8, lng: 170.5 });
    map.setZoom(5);
  }
  if (showRoute && items.length > 1) drawRoute(items);
  $("routeBtn").textContent = showRoute ? "✓ 隱藏行程路線" : "⌁ 顯示行程路線";
}
function drawRoute(items) {
  const origin = { lat: Number(items[0].lat), lng: Number(items[0].lng) };
  const destination = { lat: Number(items[items.length - 1].lat), lng: Number(items[items.length - 1].lng) };
  const waypoints = items.slice(1, -1).map(f => ({
    location: { lat: Number(f.lat), lng: Number(f.lng) },
    stopover: true
  }));
  directionsService.route({
    origin,
    destination,
    waypoints,
    optimizeWaypoints: false,
    travelMode: google.maps.TravelMode.DRIVING
  }, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
      const bounds = new google.maps.LatLngBounds();
      result.routes[0].legs.forEach(leg => {
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
      });
      map.fitBounds(bounds, 48);
    } else {
      showRoute = false;
      $("routeBtn").textContent = "⌁ 顯示行程路線";
      alert("Google Maps 暫時無法規劃這些景點之間的路線，請確認景點座標與 Directions API 設定。");
    }
  });
}

function openTripDialog(edit=false){
  const trip=edit?currentTrip():null; editingTripId=trip?.id||null;
  $("tripDialogTitle").textContent=edit?"編輯行程":"新增行程";
  $("tripNameInput").value=trip?.name||"";
  $("tripDateInput").value=trip?.days[0].date||dateISO(today);
  $("tripDaysInput").value=trip?.days.length||5;
  $("tripDialog").showModal();
}
function saveTrip(event){
  event.preventDefault();
  const name=$("tripNameInput").value.trim(),start=$("tripDateInput").value,days=Number($("tripDaysInput").value);
  if(!name||!start||!Number.isInteger(days)||days<1||days>30)return;
  if(editingTripId){
    const trip=trips.find(t=>t.id===editingTripId);
    const old=trip.days;
    trip.name=name;
    trip.days=Array.from({length:days},(_,i)=>old[i]||({date:addDays(start,i),items:[]}));
    trip.days.forEach((d,i)=>d.date=addDays(start,i));
  }else{
    const trip=makeTrip(name,start,days);trips.push(trip);currentTripId=trip.id;selectedDayIndex=0;
  }
  persist();$("tripDialog").close();render();
}
function openFavoriteDialog(){
  selectedFavoriteIds=new Set();
  $("favoriteSearch").value=""; $("favoriteCity").value="";
  renderFavoriteChoices(); $("favoriteDialog").showModal();
}
function renderFavoriteChoices(){
  const trip=currentTrip(),existing=new Set(currentDay().items.map(i=>i.favoriteId));
  const q=$("favoriteSearch").value.trim().toLowerCase(),city=$("favoriteCity").value;
  const list=FAVORITES.filter(f=>(!q||`${f.name} ${f.city}`.toLowerCase().includes(q))&&(!city||f.city===city));
  $("favoriteChoices").innerHTML=list.map(f=>`<label class="favorite-choice"><input type="checkbox" value="${f.id}" ${selectedFavoriteIds.has(f.id)?"checked":""} ${existing.has(f.id)?"disabled":""}><img src="${f.image}" alt=""><span><strong>${escapeHTML(f.name)}</strong><small>${escapeHTML(f.city)} ・ ${escapeHTML(f.description)}</small></span>${existing.has(f.id)?'<em class="already-added">已加入</em>':""}</label>`).join("")||'<p class="form-help">找不到符合條件的收藏景點。</p>';
  $("favoriteChoices").querySelectorAll("input:not(:disabled)").forEach(input=>input.addEventListener("change",()=>{const id=Number(input.value);input.checked?selectedFavoriteIds.add(id):selectedFavoriteIds.delete(id);}));
}
function addSelectedFavorites(){
  const day=currentDay();
  selectedFavoriteIds.forEach(id=>{if(!day.items.some(i=>i.favoriteId===id))day.items.push({id:crypto.randomUUID(),favoriteId:id});});
  persist();$("favoriteDialog").close();render();
}
function moveItem(id,direction){
  const items=currentDay().items,index=items.findIndex(i=>i.id===id),next=index+direction;
  if(index<0||next<0||next>=items.length)return;
  [items[index],items[next]]=[items[next],items[index]];persist();render();
}
function removeItem(id){
  if(!confirm("確定要將這個景點從當日行程移除嗎？"))return;
  currentDay().items=currentDay().items.filter(i=>i.id!==id);persist();render();
}
function reorder(dragId,targetId){
  const items=currentDay().items,from=items.findIndex(i=>i.id===dragId),to=items.findIndex(i=>i.id===targetId);
  if(from<0||to<0||from===to)return;
  const [item]=items.splice(from,1);items.splice(to,0,item);persist();render();
}

$("newTripBtn").addEventListener("click",()=>openTripDialog(false));
$("editTripBtn").addEventListener("click",()=>openTripDialog(true));
$("tripForm").addEventListener("submit",saveTrip);
$("addAttractionBtn").addEventListener("click",openFavoriteDialog);
$("emptyAddBtn").addEventListener("click",openFavoriteDialog);
$("confirmFavoritesBtn").addEventListener("click",addSelectedFavorites);
$("addDayBtn").addEventListener("click",()=>{
  const trip=currentTrip();if(trip.days.length>=30){alert("單一行程最多可安排 30 天。");return;}
  trip.days.push({date:addDays(trip.days[trip.days.length-1].date,1),items:[]});selectedDayIndex=trip.days.length-1;persist();render();
});
$("routeBtn").addEventListener("click",()=>{showRoute=!showRoute;renderMap();});
$("fitMapBtn").addEventListener("click",()=>{if (!mapReady) return; if (markers.length) { const bounds = new google.maps.LatLngBounds(); markers.forEach(marker => bounds.extend(marker.getPosition())); map.fitBounds(bounds, 48); } else { map.setCenter({lat:-43.8,lng:170.5}); map.setZoom(5); }});
$("favoriteSearch").addEventListener("input",renderFavoriteChoices);
$("favoriteCity").addEventListener("change",renderFavoriteChoices);
[...new Set(FAVORITES.map(f=>f.city))].sort().forEach(city=>$("favoriteCity").add(new Option(city,city)));
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>$(btn.dataset.close).close()));

$("tripList").addEventListener("click",e=>{
  const btn=e.target.closest("[data-trip]");if(!btn)return;
  currentTripId=btn.dataset.trip;selectedDayIndex=0;showRoute=false;render();
});
$("dayTabs").addEventListener("click",e=>{
  const btn=e.target.closest("[data-day]");if(!btn)return;
  selectedDayIndex=Number(btn.dataset.day);showRoute=false;render();
});
$("attractionList").addEventListener("click",e=>{
  const move=e.target.closest("[data-move]"),remove=e.target.closest("[data-remove]");
  if(move)moveItem(move.dataset.id,Number(move.dataset.move));
  if(remove)removeItem(remove.dataset.remove);
});
$("attractionList").addEventListener("dragstart",e=>{
  const card=e.target.closest("[data-item]");if(!card)return;
  draggedItemId=card.dataset.item;card.classList.add("dragging");e.dataTransfer.effectAllowed="move";
});
$("attractionList").addEventListener("dragend",e=>{e.target.closest("[data-item]")?.classList.remove("dragging");});
$("attractionList").addEventListener("dragover",e=>{if(e.target.closest("[data-item]"))e.preventDefault();});
$("attractionList").addEventListener("drop",e=>{
  e.preventDefault();const target=e.target.closest("[data-item]");if(target&&draggedItemId)reorder(draggedItemId,target.dataset.item);draggedItemId=null;
});

persist();render();
loadGoogleMaps();

window.addEventListener("resize", () => { if (mapReady) google.maps.event.trigger(map, "resize"); });
