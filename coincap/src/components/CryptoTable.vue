<template>
<section class="crypto-table" v-if="data.length">
  <div class="crypto-table__scroll">
    <table class="crypto-table__content">
        <thead class="crypto-table__header">
            <tr class="crypto-table__row crypto-table__row--bolded">
                <th class="crypto-table__cell">Name</th>
                <th class="crypto-table__cell">Price</th>
                <th class="crypto-table__cell crypto-table__cell--visible">Market Cap</th>
                <th class="crypto-table__cell crypto-table__cell--visible">Volume (24Hr)</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in filteredData" :key="item.id" class="crypto-table__row">
                <td class="crypto-table__cell">{{item.name}}</td>
                <td class="crypto-table__cell">{{priceFormat(item.priceUsd)}}</td>
                <td class="crypto-table__cell crypto-table__cell--visible">{{largePriceFormat(item.marketCapUsd)}}</td>
                <td class="crypto-table__cell crypto-table__cell--visible">{{largePriceFormat(item.volumeUsd24Hr)}}</td>
            </tr>
        </tbody>
    </table>
    </div>
  </section>
</template>

<script>
export default {
  name: "CryptoTable",
  data() {
    return {
      data: []
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    filteredData() {
      return this.data
        .sort((a, b) => b.marketCapUsd - a.marketCapUsd)
        .slice(0, 15);
    }
  },
  methods: {
    fetchData() {
      axios
        .get("https://api.coincap.io/v2/assets")
        .then(response => {
          this.data = response.data.data;
          this.refreshData();
        })
        .catch(() => {
          alert(response.data.error)
        });
    },
    priceFormat(value) {
      return parseFloat(value).toLocaleString("en-EN", {
        style: "currency",
        currency: "USD"
      });
    },
    largePriceFormat(num) {
      if (num >= 1000000000) {
        return `$${(num / 1000000000).toFixed(2)}b`;
      }
      if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(2)}m`;
      }
      if (num >= 1000) {
        return `$${(num / 1000).toFixed(2)}k`;
      }
      return num;
    },
    refreshData() {
      let currencies = "";
      this.filteredData.forEach((el, index) => {
        currencies += `${index === 0 ? "" : ","}${el.id}`;
      });

      const pricesWs = new WebSocket(
        `wss://ws.coincap.io/prices?assets=${currencies}`
      );

      let that = this;
      pricesWs.onmessage = function(msg) {
        that.updatePrices(JSON.parse(msg.data));
      };
    },
    updatePrices(data) {
      Object.keys(data).forEach(currencyId => {
        this.data.find(el => el.id === currencyId).priceUsd = data[currencyId];
      });
    }
  }
};
</script>


<style scoped lang="scss">
</style>
