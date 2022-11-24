<template>
  <!-- <div class="wrapper">
    <div class="container">
      <ui-input
        value="123"
        type="text"
        label="Label"
      />

      <br />

      <ui-input
        value="  Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias aspernatur numquam placeat eos cupiditate enim minima minus sint pariatur repellat earum nam, natus expedita, at, incidunt nobis velit iste. Quod, repellendus tenetur. Quis consectetur vitae corporis? Animi facere, qui architecto perferendis, nam eveniet iste incidunt tenetur suscipit molestias natus ex, quas officiis rem quia tempora explicabo quidem ratione ad quam dolore ipsa facilis quis voluptates. At repellat dicta tempore molestias porro? Soluta expedita assumenda dolor facere magnam exercitationem voluptatem hic obcaecati eos, alias laudantium error, quod explicabo. Illum cupiditate atque illo cumque nobis. Aperiam incidunt, ut deleniti non repellat quisquam."
        type="textarea"
        label="Label"
      />
    </div>
  </div> -->

  <!-- ---------------------------------------------- -->

  <!-- <ui-scrollbar :enable-internal-mode="true"> -->
  <!-- <ui-scrollbar
    :enable-internal-mode="false"
    :width="400"
    :height="400"
  >
    <div>
      <div
        style="
          height: 200px;
          width: 1000px;
          background: #aba;
          display: flex;
          justify-content: flex-end;
          color: #fff;
          font-size: 30px;
        "
      >
        !
      </div>
    </div>
  </ui-scrollbar> -->

  <!-- <div v-scrollbar>
    lorem1500
  </div> -->

  <!-- ------------------------------------------------- -->

  <div style="padding: 50px">
    <textarea
      style="
        min-width: 100px;
        width: 200px;
        min-height: 100px;
        max-height: 200px;
      "
    >
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quisquam dolore hic dolores porro officia non libero sint esse est tenetur tempora aperiam voluptas eum amet, saepe quibusdam quaerat quam cum deserunt aspernatur enim aliquid odio? Placeat quas dicta molestiae sit quibusdam voluptate! Voluptates magni rem accusantium, a, nisi quidem iusto ullam cupiditate vel pariatur soluta fuga, nam expedita. Fugit itaque aut nobis omnis officiis, qui molestias asperiores veritatis eaque molestiae assumenda repellendus? Voluptate perspiciatis unde placeat nihil sequi aliquid natus. Non sint eius placeat libero iusto, praesentium fugit, ipsa amet rem nostrum beatae accusamus pariatur asperiores officiis, accusantium deserunt?
    </textarea>

    <br />

    <textarea
      v-scrollbar="{
        areaDragRule: 'both',
        sliderColor: '250, 94, 8',
        enableInternalMode: true,
      }"
    >
    4Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quisquam dolore hic dolores porro officia non libero sint esse est tenetur tempora aperiam voluptas eum amet, saepe quibusdam quaerat quam cum deserunt aspernatur enim aliquid odio? Placeat quas dicta molestiae sit quibusdam voluptate! Voluptates magni rem accusantium, a, nisi quidem iusto ullam cupiditate vel pariatur soluta fuga, nam expedita. Fugit itaque aut nobis omnis officiis, qui molestias asperiores veritatis eaque molestiae assumenda repellendus? Voluptate perspiciatis unde placeat nihil sequi aliquid natus. Non sint eius placeat libero iusto, praesentium fugit, ipsa amet rem nostrum beatae accusamus pariatur asperiores officiis, accusantium deserunt?
    </textarea>

    <br />

    <ui-scrollbar
      :enable-internal-mode="false"
      :slider-size="12"
    >
      <textarea
        style="
          width: 300px;
          min-width: 100px;
          max-width: 400px;
          min-height: 90px;
          max-height: 300px;
        "
      >
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quisquam dolore hic dolores porro officia non libero sint esse est tenetur tempora aperiam voluptas eum amet, saepe quibusdam quaerat quam cum deserunt aspernatur enim aliquid odio? Placeat quas dicta molestiae sit quibusdam voluptate! Voluptates magni rem accusantium, a, nisi quidem iusto ullam cupiditate vel pariatur soluta fuga, nam expedita. Fugit itaque aut nobis omnis officiis, qui molestias asperiores veritatis eaque molestiae assumenda repellendus? Voluptate perspiciatis unde placeat nihil sequi aliquid natus. Non sint eius placeat libero iusto, praesentium fugit, ipsa amet rem nostrum beatae accusamus pariatur asperiores officiis, accusantium deserunt?
    </textarea
      >
    </ui-scrollbar>

    <br />

    <ui-scrollbar
      :width="200"
      :height="80"
    >
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
        quisquam dolore hic dolores porro officia non libero sint esse est
        tenetur tempora aperiam voluptas eum amet, saepe quibusdam quaerat quam
        cum deserunt aspernatur enim aliquid odio? Placeat quas dicta molestiae
        sit quibusdam voluptate! Voluptates magni rem accusantium, a, nisi
        quidem iusto ullam cupiditate vel pariatur soluta fuga, nam expedita.
        Fugit itaque aut nobis omnis officiis, qui molestias asperiores
        veritatis eaque molestiae assumenda repellendus? Voluptate perspiciatis
        unde placeat nihil sequi aliquid natus. Non sint eius placeat libero
        iusto, praesentium fugit, ipsa amet rem nostrum beatae accusamus
        pariatur asperiores officiis, accusantium deserunt?
      </div>
    </ui-scrollbar>

    <br />

    <ui-scrollbar
      :width="200"
      :height="200"
      :enable-internal-mode="true"
    >
      <div>
        <div
          style="
            height: 1000px;
            width: 1000px;
            background: #aba;
            display: flex;
            border: 1px solid;
          "
        >
          <span
            style="
              width: 10px;
              height: 10px;
              background: blue;
              align-self: flex-end;
              margin: 2px;
            "
          ></span>
          <span
            style="
              width: 10px;
              height: 10px;
              background: blue;
              margin: 2px 2px 0 auto;
            "
          ></span>
        </div>
      </div>
    </ui-scrollbar>

    <ui-scrollbar
      :width="200"
      :height="200"
      :enable-internal-mode="false"
    >
      <div>
        <div
          style="
            height: 1000px;
            width: 1000px;
            background: #aba;
            display: flex;
            border: 1px solid;
          "
        >
          <span
            style="
              width: 10px;
              height: 10px;
              background: blue;
              align-self: flex-end;
              margin: 2px;
            "
          ></span>
          <span
            style="
              width: 10px;
              height: 10px;
              background: blue;
              margin: 2px 2px 0 auto;
            "
          ></span>
        </div>
      </div>
    </ui-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'UiLib',
  data: () => ({
    isLoad: false,
  }),
  mounted() {
    setTimeout(() => {
      this.isLoad = true
    }, 1000)
  },
}
</script>

<style lang="scss">
@import '@/assets/styles';

.wrapper {
  height: 100vh;
  display: flex;
}
.container {
  margin: auto;
}
</style>
