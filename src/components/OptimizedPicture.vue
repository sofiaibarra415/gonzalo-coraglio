<template>
  <!-- Sin `<source type="image/webp">` hasta que existan los .webp (`npm run optimize-images`):
       si el WebP falta, varios navegadores no muestran el fallback del <img>. -->
  <picture>
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
import { assetUrl } from '../utils/images'

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
    return { fallback }
  }
}
</script>
