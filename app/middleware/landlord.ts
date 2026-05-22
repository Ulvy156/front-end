import { createRoleGuard } from '~/utils/roleGuard'
import { Role } from '~/types/role'

export default createRoleGuard(Role.LANDLORD)
