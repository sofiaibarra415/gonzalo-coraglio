<template>
  <picture>
    <source :srcset="webp" type="image/webp" />
    <img
      :src="fallback"
      :alt="alt"
      :class="imgClass"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
      :sizes="sizes"
      :style="imgStyle"
    />
  </picture>
</template>

<script>
import { computed } from 'vue'
import { assetUrl, webpUrl } from '../utils/images'

export default {
  name: 'OptimizedPicture',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    imgClass: { type: String, default: '' },
    loading: { type: String, default: 'lazy' },
    decoding: { type: String, default: 'async' },
    fetchpriority: { type: String, default: undefined },
    sizes: { type: String, default: undefined },
    imgStyle: { type: [String, Object], default: undefined }
  },
  setup(props) {
    const fallback = computed(() => assetUrl(props.src))
    const webp = computed(() => webpUrl(props.src))
    return { fallback, webp }
  }
}
</script>
