import { useSelector } from "react-redux"

const { currentUser } = useSelector(state => state.auth)

export const userAccess = (roles) => {
    // check if the roles are applicable
    console.log(currentUser.roles)

}