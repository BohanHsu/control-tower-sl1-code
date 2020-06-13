import React, {useEffect, useState, useCallback} from 'react';

import AddShouldPlayWindow from './AddShouldPlayWindow';
import ShouldPlayWindowList from './ShouldPlayWindowList';

function ShouldPlayWindow(props) {
  const [shouldPlayWindowList, setShouldPlayWindowList] = useState([]);

  const shouldPlayWindowServices = props.shouldPlayWindowServices;

  const _refreshShouldPlayWindowList = useCallback(() => {
    (async () => {
      const latestShouldPlayWindowList = await shouldPlayWindowServices.getAllShouldPlayWindow();

      setShouldPlayWindowList(latestShouldPlayWindowList.data.shouldPlayWindows);
    })();
  });

  useEffect(_refreshShouldPlayWindowList, []);

  return (
    <div>
      <div>
        Should Play Window
      </div>
      <AddShouldPlayWindow shouldPlayWindowServices={shouldPlayWindowServices} 
        refreshShouldPlayWindowListCallback={_refreshShouldPlayWindowList}/>
      <hr/>
      <ShouldPlayWindowList shouldPlayWindowList={shouldPlayWindowList} 
        shouldPlayWindowServices={shouldPlayWindowServices}
        refreshShouldPlayWindowListCallback={_refreshShouldPlayWindowList}/>
    </div>
  );
}


export default ShouldPlayWindow;
