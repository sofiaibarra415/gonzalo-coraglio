<template>
  <span class="project-logo-mark" :aria-hidden="true">
    <svg viewBox="0 0 24 24" class="project-logo-mark__svg">
      <rect x="0" y="0" width="24" height="24" rx="4" class="project-logo-mark__bg" />
      <g class="project-logo-mark__glyph" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square">
        <template v-if="glyph === 'grid'">
          <rect x="6" y="6" width="5" height="5" />
          <rect x="13" y="6" width="5" height="5" />
          <rect x="6" y="13" width="5" height="5" />
          <rect x="13" y="13" width="5" height="5" />
        </template>
        <template v-else-if="glyph === 'plan'">
          <path d="M12 4v16M4 12h16" />
          <rect x="9" y="9" width="6" height="6" />
        </template>
        <template v-else-if="glyph === 'levels'">
          <path d="M5 7h14M5 12h14M5 17h14" />
        </template>
        <template v-else-if="glyph === 'cross'">
          <path d="M12 5v14M5 12h14" stroke-width="2.4" />
        </template>
      </g>
    </svg>
  </span>
</template>

<script>
export default {
  name: 'ProjectLogoMark',
  props: {
    glyph: {
      type: String,
      required: true,
      validator: (v) => ['grid', 'plan', 'levels', 'cross'].includes(v)
    }
  }
}
</script>

<style scoped>
.project-logo-mark {
  display: inline-flex;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}

.project-logo-mark__svg {
  width: 100%;
  height: 100%;
}

.project-logo-mark__bg {
  fill: var(--primary-color, #2b2b2b);
}

.project-logo-mark__glyph {
  color: var(--white, #fff);
}
</style>
