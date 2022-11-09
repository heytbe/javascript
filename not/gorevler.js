class Gorevler{
    constructor(ad,tarihsaat,tamammi) {
        this.ad = ad;
        this.tarihsaat = tarihsaat;
        this.tamammi = tamammi;
    }
}

class inputkontrol{
    static deger(input){
        let sonuc = true;
        if(input.length === null){
            sonuc = false;
            return false;
        }
        return sonuc;
    }
}

class Ekran{
    constructor() {
        this.input = document.querySelector(".gorevinput");
        this.btn = document.querySelector(".goreveklebtn").addEventListener("click",this.listeekle.bind(this));
        this.listeduzenle = document.querySelector(".gorevlerdivi").addEventListener("click",this.silveguncelle.bind(this));
        this.liste = document.querySelector(".gorevlerdivi");
        this.local = new Local();
        this.tiklandimi = undefined;
    }

    silveguncelle(e){
        e.preventDefault();
        let tiklananeleman = e.target;
        if(tiklananeleman.classList.contains("gorevsil")){
            this.local.gorevdbsil(tiklananeleman.parentElement.parentElement.children[0].children[1].textContent);
            tiklananeleman.parentElement.parentElement.remove();
        }else if(tiklananeleman.classList.contains("gorevduzenle")){
            this.tiklandimi = e.target;
            this.input.value = this.tiklandimi.parentElement.parentElement.children[0].children[1].textContent;
        }
    }

    inputlaritemizle(){
        this.input.value = "";
    }


    gorevlisteyeekle(deger){
        let html = `<div class="gorevliste">
                <div class="gorevdivi">
                <input type="checkbox" name="gorev" id="gorev">
                <label for="gorev">${deger.ad}</label>
                </div>
                <div class="islemlerdivi">
                    <button class="gorevduzenle">D</button>
                    <button class="gorevsil">S</button>
                </div>
            </div>`;

        this.liste.insertAdjacentHTML("beforeend",html);
    }

    listeekle(e){
        e.preventDefault();
        let zaman = new Date();
        let tarihsaat = zaman.getDate() + "." + parseInt(zaman.getMonth() + 1) + "." + zaman.getUTCFullYear() + " / " + zaman.toTimeString();
            if(this.tiklandimi){
                let gorevler = new Gorevler(this.input.value,tarihsaat);
                this.local.dbguncelle(this.tiklandimi.parentElement.parentElement.children[0].children[1].textContent,gorevler);
                this.tiklandimi.parentElement.parentElement.children[0].children[1].textContent = this.input.value;
                this.tiklandimi = undefined;
                this.inputlaritemizle();
            }else {
                let gorevler = new Gorevler(this.input.value, tarihsaat);
                this.gorevlisteyeekle(gorevler);
                this.local.gorevdbekle(gorevler);
                this.inputlaritemizle();
            }
    }

    ekrandahtmlgosterlocal(){
        this.local.gorevdizi.forEach(gorevler=>{
           this.gorevlisteyeekle(gorevler);
        });
    }
}

class Local{
    constructor() {
        this.gorevdizi = this.gorevler();
    }

    gorevler(){
        let gorevdizi;
        if(localStorage.getItem("gorevler") === null){
            gorevdizi = [];
        }else{
            gorevdizi = JSON.parse(localStorage.getItem("gorevler"));
        }

        return gorevdizi;
    }

    gorevdbekle(deger){
        this.gorevdizi.push(deger);
        localStorage.setItem("gorevler",JSON.stringify(this.gorevdizi));
    }

    gorevdbsil(deger){
        this.gorevdizi.forEach((value,key)=>{
           if(value.ad === deger){
               this.gorevdizi.splice(key,1);
           }
        });
        localStorage.setItem("gorevler",JSON.stringify(this.gorevdizi));
    }

    dbguncelle(deger,guncellenmisalan){
        this.gorevdizi.forEach((value,key)=>{
            console.log(value.ad + " " + key)
           if(value.ad === deger){
               this.gorevdizi[key] = guncellenmisalan;
               console.log(this.gorevdizi);
           }
        });
        localStorage.setItem("gorevler",JSON.stringify(this.gorevdizi));
    }

}

document.addEventListener("DOMContentLoaded",function (){
   let ekran = new Ekran();
   ekran.ekrandahtmlgosterlocal();
});
