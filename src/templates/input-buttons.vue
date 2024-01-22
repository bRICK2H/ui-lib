<template>
  <div>
    <h1>Checkbox - value</h1>

    <h3>value: Number</h3>

    <ui-checkbox
      v-for="(value, i) of checkbox.values1"
      :key="`checkbox-number:${i}`"
      :label="`${value}:`"
      :value="value"
      :checked="i === 0"
      label-side="left"
    />

    <h3>value: String</h3>

    <ui-checkbox
      v-for="(value, i) of checkbox.values2"
      :key="`checkbox-string:${i}`"
      :label="`${value}:`"
      :value="value"
      :checked="i === 0"
      label-side="left"
    />

    <h3>value: Boolean</h3>

    <ui-checkbox
      v-for="(value, i) of checkbox.values3"
      :key="`checkbox-boolean:${i}`"
      :label="`${value}:`"
      :value="value"
      :checked="i === 0"
      label-side="left"
    />

    <h3>value: Object</h3>

    <ui-checkbox
      v-for="(value, i) of checkbox.values4"
      :key="`checkbox-object:${i}`"
      :label="`${value.name}:`"
      :value="value"
      :checked="i === 0"
      label-side="left"
    />

    <h1>Checkbox - v-model</h1>

    <h3>v-model: Number[]</h3>

    <ui-checkbox
      v-for="(value, i) of checkbox.values1"
      :key="`checkbox-value-number:${i}`"
      v-model="checkbox.model1"
      :label="`${value}:`"
      :value="value"
      label-side="left"
    />

    <h3>v-model: String[]</h3>

    <ui-checkbox
      v-for="(value, i) of checkbox.values2"
      :key="`checkbox-value-string:${i}`"
      v-model="checkbox.model2"
      :label="`${value}:`"
      :value="value"
      label-side="left"
    />

    <h3>v-model: Object[]</h3>

    <ui-checkbox
      v-for="(value, i) of checkbox.values4"
      :key="`checkbox-value-object:${i}`"
      v-model="checkbox.model3"
      :label="`${value.name}:`"
      :value="value"
      label-side="left"
    />

    <hr />

    <h1>Radio - value</h1>

    <h3>value - Number</h3>

    <ui-radio
      v-for="(value, i) of radio.values1"
      :key="`radio-value-number:${i}`"
      :label="`${value}:`"
      name="value1"
      :checked="i === 0"
      :value="value"
      label-side="left"
    />

    <h3>value - String</h3>

    <ui-radio
      v-for="(value, i) of radio.values2"
      :key="`radio-value-string:${i}`"
      :label="`${value}:`"
      name="value2"
      :checked="i === 0"
      :value="value"
      label-side="left"
    />

    <h3>value - Boolean</h3>

    <ui-radio
      v-for="(value, i) of radio.values3"
      :key="`radio-value-boolean:${i}`"
      :label="`${value}:`"
      name="value3"
      :checked="i === 0"
      :value="value"
      label-side="left"
    />

    <h3>value - Object</h3>

    <ui-radio
      v-for="(value, i) of radio.values4"
      :key="`radio-value-object:${i}`"
      :label="`${value.name}:`"
      name="value4"
      :checked="i === 0"
      :value="value"
      label-side="left"
    />

    <h1>Radio - v-model</h1>

    <h3>v-model - Number</h3>

    <ui-radio
      v-for="(value, i) of radio.values1"
      :key="`radio-v-model-number:${i}`"
      v-model="radio.model1"
      :label="`${value}:`"
      name="model1"
      :value="value"
      label-side="left"
    />

    <h3>v-model - String</h3>

    <ui-radio
      v-for="(value, i) of radio.values2"
      :key="`radio-v-model-string:${i}`"
      v-model="radio.model2"
      :label="`${value}:`"
      name="model2"
      :value="value"
      label-side="left"
    />

    <h3>v-model - Object</h3>

    <ui-radio
      v-for="(value, i) of radio.values4"
      :key="`radio-v-model-object:${i}`"
      v-model="radio.model3"
      :label="`${value.name}:`"
      name="model3"
      :value="value"
      label-side="left"
    />
  </div>
</template>

<script>
export default {
  name: 'VInputButtons',

  data: () => ({
    checkbox: {
      model1: [1],
      model2: ['One'],
      model3: [{ name: 'Tom', age: 20 }],

      values1: [1, 2, 3],
      values2: ['One', 'Two', 'Three'],
      values3: [false, false, false],
      values4: [
        { name: 'Tom', age: 20 },
        { name: 'Den', age: 30 },
        { name: 'Sem', age: 40 },
      ],
    },

    radio: {
      model1: 1,
      model2: 'One',
      model3: { name: 'Tom', age: 20 },

      values1: [1, 2, 3],
      values2: ['One', 'Two', 'Three'],
      values3: [false, false, false],
      values4: [
        { name: 'Tom', age: 20 },
        { name: 'Den', age: 30 },
        { name: 'Sem', age: 40 },
      ],
    },
  }),
}
</script>

<style lang="scss"></style>
