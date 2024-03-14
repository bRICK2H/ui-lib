<template>
  <!-- <ui-scrollbar> -->
  <!-- <VButtonTemplate /> -->
  <!-- <IParent /> -->

  <!-- <UiExampleLoader /> -->

  <!-- </ui-scrollbar> -->

  <div style="height: 100%; padding: 20px">
    <!-- <VInputButton /> -->

    <!-- <VTableContainer /> -->

    <v-template-filters />

    <!-- <table
      style="
        display: block;
        width: 100%;
        border: 1px solid red;
        border-collapse: collapse;
      "
    >
      <thead>
        <tr>
          <th class="col">1</th>
          <th class="col lorem">Batman</th>
          <th class="col">Robin</th>
          <th class="col">The Flash</th>
          <th class="col">Kid Flash</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th class="col">Skill</th>
          <td class="col">
            <div class="lorem">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Similique aut exercitationem hic eius omnis nisi ullam eaque
              labore! Maxime, cum voluptas?
            </div>
          </td>
          <td class="col">Dex, acrobat</td>
          <td class="col">4</td>
          <td
            class="col"
            style="width: 100%"
          >
            Super speed
          </td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<script>
import VTableContainer from '@/templates/table/index.vue'
import UiExampleLoader from '@/components/_global/loader/example'
// import VButtonTemplate from './components/button/templates'
// import IParent from '@/components/old/parent.vue'

import VInputButton from '@/templates/input-buttons.vue'
import VTemplateFilters from '@/templates/filtres.vue'

export default {
  name: 'UiLib',
  components: {
    // IParent,
    // VTableContainer,
    VTemplateFilters,
    // VInputButton,
    // VButtonTemplate,
    // UiExampleLoader,
  },
  data: () => ({
    checkbox: [1, 2],
    selected: [
      {
        userName: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        email: 'alex@mail.ru',
        count: 0,
        test: '0',
        test2: '0',
      },
      {
        userName: 'Den Brown',
        email: 'den@mail.ru',
        count: 2,
        test: '000',
        test2: '000',
      },
      {
        userName: 'Azazat JOPOV',
        email: 'jopov@mail.ru',
        count: 10,
        test: '1000',
        test2: '10000',
      },
    ],
    // selected: {
    //   userName: 'Janna Di',
    //   email: 'jannameagasuperhugeemail@mail.ru',
    //   count: 1,
    //   test: '00',
    //   test2: '00',
    // },
    disabled: false,
    isLoading: false,
    pagination: { page: 1, total: 75, limit: 5, pages: 10 },
    title: 1,
    size: 'md',
    isShow: true,
    loading: false,
    iconName: 'area-drag',
    table: [],
    scrollKey: 0,
  }),

  created() {
    // this.$preloader({
    //   test: 1,
    //   visible: true,
    // })
    // setTimeout(() => {
    //   this.$preloader({
    //     visible: false,
    //   })
    // }, 3000)
  },
  async mounted() {
    // await this.wait()
    // console.warn('AFTER THAT')
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 2000)

    setTimeout(() => {
      this.table = [
        {
          userName: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
          email: 'alex@mail.ru',
          count: 0,
          test: '0',
          test2: '0',
        },
        {
          userName: 'Janna Di',
          email: 'jannameagasuperhugeemail@mail.ru',
          count: 1,
          test: '00',
          test2: '00',
        },
        {
          userName: 'Den Brown',
          email: 'den@mail.ru',
          count: 2,
          test: '000',
          test2: '000',
        },
        {
          userName: 'Azazat JOPOV',
          email: 'jopov@mail.ru',
          count: 10,
          test: '1000',
          test2: '10000',
        },
      ]
    }, 1000)
  },

  methods: {
    addObj() {
      this.scrollKey++
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 1000)

      this.table.push({
        userName: this.scrollKey++ + 'Артур Жопов',
        email: this.scrollKey++ + 'jopov@mail.ru',
        count: this.scrollKey++,
        test: '1000',
        test2: '10000',
      })
    },

    eventCell(v) {
      console.log(v)
    },
    load() {
      // this.iconName = 'add'

      // this.isShow = !this.isShow

      this.title++
      // console.log(this.title)

      // setTimeout(() => {
      //   this.loading = false
      // }, 3000)
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/styles';

body {
  height: 100vh;
}

.wrapper {
  padding: 20px;
  display: flex;
  background: lightblue;

  & .ui-table-body-cell-data.class-cell {
    color: red;
    font-size: $av-font-size-xxs;
  }
}

.col {
  border: 1px solid red;
  // width: fit-content;
  // max-width: 500px;

  // min-width: 100px;
  @include ellipsis;
}
</style>
