<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left">
                <b>Management Produk</b>
              </p>
              <p class="card-description float-right">
                <!-- tombol untuk refresh Data -->
                <b-button
                  v-on:click="getData"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Refresh Data"
                >
                
                  <i class="mdi mdi-refresh btn-icon-prepend"></i>
                </b-button>&nbsp;&nbsp;
                <b-button variant="success" v-b-modal.modalEdit v-on:click="Add">
                  <i class="mdi mdi-plus btn-icon-prepend"></i>
                  Produk
                </b-button>
              </p>
              <!-- Search Data -->
              <b-form-input type="text" v-on:keyup.enter="searching" v-model="search" placeholder="Cari Produk..."></b-form-input>
                  <div class="dropdown-divider"></div> 
              <div class="table-responsive">
                <b-table striped hover :items="produks" :fields="fields">
                  <template v-slot:cell(aksi)="data">
                    <b-button
                      size="sm"
                      variant="success"
                      v-on:click="TambahBerat(data.item)"
                      v-b-modal.modalTambahBerat
                    >
                      <!-- <i class="mdi mdi-pencil btn-icon-prepend"></i>  -->
                      <span class="material-icons">+</span>
                    </b-button>&nbsp;
                    <b-button
                      size="sm"
                      variant="danger"
                      v-on:click="KurangBerat(data.item)"
                      v-b-modal.modalKurangBerat
                    >
                      <!-- <i class="mdi mdi-pencil btn-icon-prepend"></i>  -->
                      <span class="material-icons">-</span>
                    </b-button>&nbsp;
                    <b-button
                      size="sm"
                      variant="info"
                      v-on:click="Edit(data.item)"
                      v-b-modal.modalEdit
                    >
                      <i class="mdi mdi-pencil btn-icon-prepend"></i>
                    </b-button>&nbsp;
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id)">
                      <i class="mdi mdi-delete btn-icon-prepend"></i>
                    </b-button>
                  </template>
                </b-table>

                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination"
                ></b-pagination>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>
              </div>

              <!-- COBA CARD -->
              <!-- <b-card-group deck>
                <b-card v-for="(produk, index) in produks" :key="index" :title="nama_produk">
                  <b-card-text>{{ berat_produk }} {{satuan_berat}}</b-card-text>
                  <template v-slot:cell(aksi)="data">
                    <b-button
                      size="sm"
                      variant="success"
                      v-on:click="TambahBerat(data.item)"
                      v-b-modal.modalTambahBerat
                    >
                      <span class="material-icons">+</span>
                    </b-button>&nbsp;
                    <b-button
                      size="sm"
                      variant="danger"
                      v-on:click="KurangBerat(data.item)"
                      v-b-modal.modalKurangBerat
                    >
                      <span class="material-icons">-</span>
                    </b-button>&nbsp;
                    <b-button
                      size="sm"
                      variant="info"
                      v-on:click="Edit(data.item)"
                      v-b-modal.modalEdit
                    >
                      <i class="mdi mdi-pencil btn-icon-prepend"></i>
                    </b-button>&nbsp;
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id)">
                      <i class="mdi mdi-delete btn-icon-prepend"></i>
                    </b-button>
                  </template>
                </b-card>
              </b-card-group> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal id="modalEdit" @ok="Save">
      <template v-slot:modal-title>Form Edit Produk</template>
      <form ref="form">
        <div class="form-group">
          <label for="nama_produk" class="col-form-label">Nama Produk</label>
          <input
            type="text"
            name="nama_produk"
            class="form-control"
            id="nama_produk"
            placeholder="Nama Produk"
            v-model="nama_produk"
          />
        </div>
        <div class="form-group">
          <label for="berat_produk" class="col-form-label">Berat Produk</label>
          <input
            type="text"
            name="berat_produk"
            class="form-control"
            id="berat_produk"
            placeholder="Berat Produk"
            v-model="berat_produk"
          />
        </div>
        <div class="form-group" @keyup.enter="save">
          <label for="satuan_berat" class="col-form-label">Satuan</label>
          <select
            class="form-control"
            name="satuan_berat"
            id="satuan_berat"
            v-model="satuan_berat"
            placeholder="Satuan berat"
          >
            <option value="kg" checked>Kg</option>
            <option value="ons">Ons</option>
            <option value="gram">Gram</option>
            <option value="mg">Mg</option>
          </select>
        </div>
      </form>
    </b-modal>

    <!-- MODAL UNTUK MENAMBAH BERAT PRODUK -->
    <b-modal id="modalTambahBerat" @ok="Save">
      <template v-slot:modal-title>Form Tambah Berat Produk</template>
      <form ref="form">
        <h4>{{ nama_produk }}</h4>
        <div class="form-group">
          <label for="berat_tambah" class="col-form-label">Berat {{ nama_produk }}</label>
          <input
            type="text"
            name="berat_tambah"
            class="form-control"
            id="berat_tambah"
            placeholder="Tambah Berat Produk"
            v-model="berat_tambah"
          />
        </div>
        <div class="form-group" @keyup.enter="save">
          <label for="satuan_berat" class="col-form-label">Satuan</label>
          <select
            class="form-control"
            name="satuan_berat"
            id="satuan_berat"
            v-model="satuan_berat"
            placeholder="Satuan Berat"
          >
            <option value="kg" checked>Kg</option>
            <option value="ons">Ons</option>
            <option value="gram">Gram</option>
            <option value="mg">Mg</option>
          </select>
        </div>
      </form>
    </b-modal>

    <!-- MODAL UNTUK MENGURANGI BERAT PRODUK -->
    <b-modal id="modalKurangBerat" @ok="Save">
      <template v-slot:modal-title>Form Kurang Berat Produk</template>
      <form ref="form">
        <h4>{{ nama_produk }}</h4>
        <div class="form-group">
          <label for="berat_kurang" class="col-form-label">Berat {{ nama_produk }}</label>
          <input
            type="text"
            name="berat_kurang"
            class="form-control"
            id="berat_kurang"
            placeholder="Kurangi Berat Produk"
            v-model="berat_kurang"
          />
        </div>
        <div class="form-group" @keyup.enter="save">
          <label for="satuan_berat" class="col-form-label">Satuan</label>
          <select
            class="form-control"
            name="satuan_berat"
            id="satuan_berat"
            v-model="satuan_berat"
            placeholder="Satuan Berat"
          >
            <option value="kg" checked>Kg</option>
            <option value="ons">Ons</option>
            <option value="gram">Gram</option>
            <option value="mg">Mg</option>
          </select>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      id: "",
      nama_produk: "",
      berat_produk: "",
      satuan_berat: "",
      berat_tambah: "",
      berat_kurang: "",
      produks: [],
      
      refreshData: true,
      search: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      fields: ["nama_produk", "berat_produk", "satuan_berat", "aksi"],
    };
  },

  methods: {
    getData: function () {
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      this.axios
        .get("getProduk", conf)
        .then((response) => {
          if (response.data.status == 1) {
            this.$bvToast.hide("loadingToast");
            this.produks = response.data.produk;
            this.rows = response.data.count;
          } else {
            this.$bvToast.hide("loadingToast");
            this.message = "Gagal menampilkan data Produk.";
            this.$bvToast.show("message");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    pagination: function () {
      if (this.search == "") {
        this.getData();
      } else {
        this.searching();
      }
    },

    // refresh: function (){
    //   if (this.refresh == true){
    //     this.getData();
    //   }
    // },

    searching : function(){
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      let form = new FormData();
      form.append("find", this.search);
      this.axios.post( "/cariProduk/" + this.perPage + "/" + offset, form)
      .then(response => {
          if(response.data.status == 1){
          this.$bvToast.hide("loadingToast");
          this.produks = response.data.produk;
          this.rows = response.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan Data Produk."
          this.$bvToast.show("message");
        }
      })
      .catch(error => {
          console.log(error);
      });
    },

    // searching : function(){
    //   let offset = (this.currentPage - 1) * this.perPage;
    //   this.$bvToast.show("loadingToast");
    //   let form = new FormData();
    //   form.append("find", this.search);
    //   this.axios.post( "cariProduk", + this.perPage + "/" + offset, form)
    //   .then(response => {
    //       if(response.data.status == 1){
    //       this.$bvToast.hide("loadingToast");
    //       this.data_poin = response.data.produk;
    //       this.rows = response.data.count;
    //     } else {
    //       this.$bvToast.hide("loadingToast");
    //       this.message = "Gagal menampilkan Data Produk."
    //       this.$bvToast.show("message");
    //     }
        
    //   })
    //   .catch(error => {
    //       console.log(error);
    //   });
    // },

    Add: function () {
      this.action = "insert";
      this.nama_produk = "";
      this.berat_produk = "";
      this.satuan_berat = "";
    },

    TambahBerat: function (item) {
      this.action = "tambahBerat";
      this.id = item.id;
      this.nama_produk = item.nama_produk;
      this.berat_tambah = "";
      this.satuan_berat = item.satuan_berat;
    },

    KurangBerat: function (item) {
      this.action = "kurangBerat";
      this.id = item.id;
      this.nama_produk = item.nama_produk;
      this.berat_tambah = "";
      this.satuan_berat = item.satuan_berat;
    },

    Edit: function (item) {
      this.action = "update";
      this.id = item.id;
      this.nama_produk = item.nama_produk;
      this.berat_produk = item.berat_produk;
      this.satuan_berat = item.satuan_berat;
    },

    Save: function () {
      this.$bvToast.show("loadingToast");
      if (this.action === "insert") {
        let form = new FormData();
        form.append("id", this.id);
        form.append("nama_produk", this.nama_produk);
        form.append("berat_produk", this.berat_produk);
        form.append("satuan_berat", this.satuan_berat);

        this.axios
          .post("createProduk", form)
          .then((response) => {
            this.$bvToast.hide("loadingToast");
            if (this.search == "") {
              this.getData();
            } else {
              this.searching();
            }
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (this.action === "tambahBerat") {
        let form = {
          berat_tambah: this.berat_tambah,
          satuan_berat: this.satuan_berat,
        };
        this.axios
          .put("tambahBerat/" + this.id, form)
          .then((response) => {
            this.$bvToast.hide("loadingToast");
            if (this.search == "") {
              this.getData();
            } else {
              this.searching();
            }
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (this.action === "kurangBerat") {
        let form = {
          berat_kurang: this.berat_kurang,
          satuan_berat: this.satuan_berat,
        };
        this.axios
          .put("kurangBerat/" + this.id, form)
          .then((response) => {
            this.$bvToast.hide("loadingToast");
            if (this.search == "") {
              this.getData();
            } else {
              this.searching();
            }
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        let form = {
          nama_produk: this.nama_produk,
          berat_produk: this.berat_produk,
          satuan_berat: this.satuan_berat,
        };
        this.axios
          .put("updateProduk/" + this.id, form)
          .then((response) => {
            this.$bvToast.hide("loadingToast");
            if (this.search == "") {
              this.getData();
            } else {
              this.searching();
            }
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    Drop: function (id) {
      if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
        this.$bvToast.show("loadingToast");
        this.axios
          .delete("hapusProduk/" + id)
          .then((response) => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    mounted(){
    this.key = localStorage.getItem("Authorization");
      if (this.refreshData == true) {
      this.getData();        
      }
    },
  },
};
</script>
