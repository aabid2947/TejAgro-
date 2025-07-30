import React from 'react';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';


const EditIcon = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60) }) => {
    const svg = `<svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.114 17.686a1.03 1.03 0 0 1-.277-.799l.363-4.17c.04-.457.234-.888.546-1.213l8.622-8.996c.672-.705 1.892-.67 2.602.069l2.624 2.738h.001c.733.767.763 1.985.065 2.715l-8.622 8.997a1.86 1.86 0 0 1-1.163.569l-3.996.378-.088.003a.94.94 0 0 1-.677-.291m11.237-9.03-2.583-2.694 1.867-1.95 2.582 2.695zm-6.65 6.946-2.853.271.253-2.955L11.484 7.3l2.584 2.697zm9.507 6.375c.527 0 .958-.45.958-1 0-.549-.43-1-.958-1H4.791c-.526 0-.958.451-.958 1 0 .55.432 1 .958 1z" fill="#6D7366"/>
    </svg>`;
    return <SvgXml width={width} height={height} xml={svg} />;
};

export default EditIcon;