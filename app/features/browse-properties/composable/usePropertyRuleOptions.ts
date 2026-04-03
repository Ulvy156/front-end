import { computed } from 'vue'
import { useAsyncData } from '#imports'

import { useApi } from '~/composables/useApi'
import {
  fetchPropertyRuleOptions,
  type PropertyRuleOption,
} from '../services/browse-properties'

export function usePropertyRuleOptions() {
  const api = useApi()
  const { data, status } = useAsyncData<PropertyRuleOption[]>(
    'property-rule-options',
    () => fetchPropertyRuleOptions(api),
    {
      default: () => [],
    },
  )

  return {
    data: computed(() => data.value ?? []),
    isFetching: computed(() => status.value === 'pending'),
  }
}
