class Notlar{
    constructor(baslik,not,tarihsaat) {
        this.baslik     = baslik;
        this.not        = not;
        this.tarihsaat  = tarihsaat;
    }
}

class Util{
    static bosalankontrol(...inputlar){
        let sonuc = true;
        inputlar.forEach(deger => {
           if(deger.length === 0){
               sonuc = false;
               return false;
           }
        });
        return sonuc;
    }
}

class Degiskenler{
    constructor() {
        this.notekle = document.querySelector(".notadd").addEventListener("click",this.modalac.bind(this));
        this.noteklemodal = document.querySelector(".noteklemodal");
        this.noteklemodalbtn = document.querySelector(".noteklemodal .btn .noteklebtn").addEventListener("click",this.kaydetguncelle.bind(this));
        this.modalkapat = document.querySelector(".modalkapat").addEventListener("click",this.modalkapat.bind(this));
        this.notekleinput = document.querySelector(".notekleinput");
        this.notekletextarea = document.querySelector("#notekletextarea");
        this.notlaralani = document.querySelector(".notlar .notlardivi");
        this.depo = new depo();
        this.secilieleman = undefined;
    }

    ekrandagoster(){
        this.depo.tumnotlar.forEach(notlar=>{
           this.htmlekle(notlar);
        });
    }

    modalac(){
        this.noteklemodal.style.display = "block";
        document.querySelector(".noteklebtn").textContent = "Ekle";
    }

    modalkapat(e){
        e.preventDefault();
        this.noteklemodal.style.display = "none";
        this.inputtemizlekapat();
    }

    inputtemizlekapat(){
        this.notekleinput.value = "";
        this.notekletextarea.value = "";
        this.noteklemodal.style.display = "none";
    }

    htmlekle(not){
        let html = `<div class="notbox">
                <span class="baslik">${not.baslik}</span>
                <p class="notalaninotekle">${not.not}</p>
                <div class="footer">${not.tarihsaat}</div>
                <div class="islemler" style="display: none;">
                    <div class="buttonlar">
                        <button class="notduzenle">Düzenle</button>
                        <button class="notsilbtn">Sil</button>
                    </div>
                </div>
            </div>`;

        this.notlaralani.insertAdjacentHTML("beforeend",html);
        let notbox = document.querySelectorAll(".notbox");
        notbox.forEach((value,key)=> {
            value.addEventListener("mouseover", (e) => {
                value.children[3].style.display = "block";
            });
            value.addEventListener("mouseout", (e) => {
                value.children[3].style.display = "none";
            });
        });

        notbox.forEach((value,key)=>{
           value.addEventListener("click",(e)=>{
             e.preventDefault();
             if(e.target.classList.contains("notsilbtn")){
                 this.secilieleman = e.target.parentElement.parentElement.parentElement;
                 this.secilieleman.remove();
                 this.depo.notsil( this.secilieleman.children[0].textContent);
                 this.secilieleman = undefined;
             }else if(e.target.classList.contains("notduzenle")){
                 this.secilieleman = e.target;
                 this.noteklemodal.style.display = "block";
                 this.notekleinput.value = this.secilieleman.parentElement.parentElement.parentElement.children[0].textContent;
                 this.notekletextarea.value = this.secilieleman.parentElement.parentElement.parentElement.children[1].textContent;
                 document.querySelector(".noteklebtn").textContent = "Güncelle";
             }
           });
        });

    }

    kaydetguncelle(e){
        e.preventDefault();
        let zaman = new Date();
        let tarihsaat =  zaman.getDate()+"."+parseInt(zaman.getMonth() + 1)+"."+zaman.getUTCFullYear()+" / "+zaman.toTimeString();
        let notlar = new Notlar(this.notekleinput.value,this.notekletextarea.value,tarihsaat);
        let sonuc = Util.bosalankontrol(notlar.baslik,notlar.not);
        if(sonuc){
            if(this.secilieleman){
                let notlar = new Notlar(this.notekleinput.value,this.notekletextarea.value,tarihsaat)
                this.depo.notguncelle(notlar,this.secilieleman.parentElement.parentElement.parentElement.children[0].textContent)
                this.secilieleman.parentElement.parentElement.parentElement.children[0].textContent = this.notekleinput.value;
                this.secilieleman.parentElement.parentElement.parentElement.children[1].textContent = this.notekletextarea.value;
                this.secilieleman.parentElement.parentElement.parentElement.children[2].textContent = tarihsaat;
                this.noteklemodal.style.display = "none";
                this.secilieleman = undefined;
            }else{
                this.htmlekle(notlar);
                this.depo.notekle(notlar);
            }
            this.inputtemizlekapat();
        }else {
            console.log("boş alanlar var");
        }

    }

}

class depo{
    constructor() {
        this.tumnotlar = this.verilerigetir();
    }

    verilerigetir(){
        let notlardizisi;
        if(localStorage.getItem("notlar") === null){
            notlardizisi = []
        }else{
            notlardizisi = JSON.parse(localStorage.getItem("notlar"));
        }
        return notlardizisi;
    }

    notekle(not){
        this.tumnotlar.push(not);
        localStorage.setItem("notlar",JSON.stringify(this.tumnotlar));
    }

    notsil(baslik){
        this.tumnotlar.forEach((value,key)=>{
           if(value.baslik === baslik){
               this.tumnotlar.splice(key,1);
           }
        });
        localStorage.setItem("notlar",JSON.stringify(this.tumnotlar));
    }

    notguncelle(not,baslik){
        this.tumnotlar.forEach((value,key)=>{
           if(value.baslik === baslik){
               this.tumnotlar[key] = not;
           }
        });
        localStorage.setItem("notlar",JSON.stringify(this.tumnotlar));
    }

}

document.addEventListener("DOMContentLoaded",function (){
   let degiskenler = new Degiskenler();
   degiskenler.ekrandagoster();
});