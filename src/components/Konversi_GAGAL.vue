<template>
  <div>
    <div class="container mt-3">
      <table border="1">
        <thead>
          <td>no</td>
          <td>produk</td>
          <td>berat</td>
          <td>satuan</td>
          <td>aksi</td>
        </thead>
        <tbody>
          <td>
            {{ produk.id }}
          </td>
          <td>
            {{ produk.nama_produk }}
          </td>
          <td>
            {{ produk.berat_produk }}
          </td>
          <td>
            {{ produk.satuan_berat }}
          </td>
        </tbody>
      </table>
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left">
                <b>Management Produk</b>
              </p>
              <p class="card-description float-right">
                <b-button
                  variant="success"
                  v-b-modal.modalProduk
                  v-on:click="Add"
                >
                  <i class="mdi mdi-plus btn-icon-prepend"></i> Tambah
                </b-button>
              </p>
              <div class="table-responsive">
                <b-table striped hover :items="produk" :fields="fields">
                  <template v-slot:cell(aksi)="data">
                    <b-button
                      size="sm"
                      variant="info"
                      v-on:click="Edit(data.item)"
                      v-b-modal.modalProduk
                    >
                      <i class="mdi mdi-pencil btn-icon-prepend"></i>
                      Ubah </b-button
                    >&nbsp;
                    <b-button
                      size="sm"
                      variant="danger"
                      v-on:click="Drop(data.item.id)"
                    >
                      <i class="mdi mdi-delete btn-icon-prepend"></i> Hapus
                    </b-button>
                  </template>
                </b-table>

                <!-- <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination"
                ></b-pagination> -->

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal id="modalProduk" @ok="Save">
      <template v-slot:modal-title>Form Produk</template>
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
        <div class="form-group">
          <label for="satuan_berat" class="col-form-label">Satuan</label>
          <select
            class="form-control"
            name="satuan_berat"
            id="satuan_berat"
            v-model="satuan_berat"
            placeholder="Satuan Produk"
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
  data: function() {
    return {
      search: "",

      action: "",
      message: "",
      fields: ["nama_produk", "berat_produk", "satuan_berat", "aksi"],

      id: "",
      nama_produk: "",
      berat_produk: "",
      satuan_berat: "",
      produk: [],
    };
  },

  methods: {
    getData: function() {
      this.$bvToast.show("loadingToast");
      this.axios
        .get("http://127.0.0.1:8000/api/getProduk")
        .then((response) => {
          if (response.data.status == 1) {
            this.$bvToast.hide("loadingToast");
            // console.log(this.produk);
            this.produk = response.data.produk;
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

    pagination: function() {
      if (this.search == "") {
        this.getData();
      } else {
        this.searching();
      }
    },

    Add: function() {
      this.action = "insert";
      this.nama_produk = "";
      this.berat_produk = "";
      this.satuan_berat = "";
    },

    Edit: function(item) {
      this.action = "update";
      this.id = item.id;
      this.nama_produk = item.nama_produk;
      this.berat_produk = item.berat_produk;
      this.satuan_berat = item.satuan_berat;
    },

    Save: function() {
      this.$bvToast.show("loadingToast");
      if (this.action === "insert") {
        let form = new FormData();
        form.append("id", this.id);
        form.append("nama_produk", this.nama_produk);
        form.append("berat_produk", this.berat_produk);
        form.append("satuan_berat", this.satuan_berat);

        this.axios
          .post("http://127.0.0.1:8000/api/createProduk", form)
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
          .put("http://localhost:8000/api/updateProduk/" + this.id, form)
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

    Drop: function(id) {
      if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
        this.$bvToast.show("loadingToast");
        this.axios
          .delete("http://127.0.0.1:8000/api/hapusProduk/" + id)
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
  },
};
</script>

<style></style>
