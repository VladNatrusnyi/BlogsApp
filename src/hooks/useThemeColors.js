import {appColors} from "../appMock";
import {useSelector} from "react-redux";

function useThemeColors() {
    const { theme } = useSelector(state => state.theme);
    const themeColors = appColors[theme];

    return themeColors;
}

export default useThemeColors;