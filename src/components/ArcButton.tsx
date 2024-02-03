/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {polarToCartesian} from '../Utils';

function ArcButton(props: {
  x: number;
  y: number;
  innerRadius: number;
  thickness: number;
  startAngle: number;
  endAngle: number;
  color: string;
  pressed: boolean;
}) {
  const shrink = 2;

  const x = props.x;
  const y = props.y;
  const r = props.innerRadius; // inner arc radius
  const t = props.thickness; // thickness
  const cr = props.thickness / 4; // corner radius
  const sa =
    -(props.startAngle + (props.pressed ? shrink : 0)) * (Math.PI / 180); // start angle
  const ea = -(props.endAngle - (props.pressed ? shrink : 0)) * (Math.PI / 180); // end angle
  const large = Math.abs(ea - sa) > Math.PI ? 1 : 0; // large arc flag
  const center = r + t + 1; // center of the circle

  const bottomCornerAngle = Math.acos((2 * r ** 2 - cr ** 2) / (2 * r ** 2));
  const topCornerAngle = Math.acos(
    (2 * (r + t) ** 2 - cr ** 2) / (2 * (r + t) ** 2),
  );

  const start = polarToCartesian(center, center, r, sa);
  const end = polarToCartesian(center, center, r, ea);
  const c1 = {
    x: start.x + cr * Math.cos(sa),
    y: start.y + cr * Math.sin(sa),
  };
  const c2 = polarToCartesian(center, center, r, sa - bottomCornerAngle);
  const c3 = polarToCartesian(center, center, r, ea + bottomCornerAngle);
  const c4 = {
    x: end.x + cr * Math.cos(ea),
    y: end.y + cr * Math.sin(ea),
  };
  const c5 = {
    x: (t - cr * 2) * Math.cos(ea),
    y: (t - cr * 2) * Math.sin(ea),
  };
  const c6 = polarToCartesian(center, center, r + t, ea + topCornerAngle);
  const c7 = polarToCartesian(center, center, r + t, sa - topCornerAngle);
  const c8 = polarToCartesian(center, center, r + t - cr, sa);

  // prettier-ignore
  return (
    <View style={{position: 'absolute', top: y - center, left: x - center }}>
      <Svg width={(center) * 2} height={center * 2}>
        <Path
          d={`
              M ${c1.x} ${c1.y}
              A ${cr} ${cr} 0 0 1 ${c2.x} ${c2.y}
              A ${r} ${r} 0 ${large} 0 ${c3.x} ${c3.y}
              A ${cr} ${cr} 0 0 1 ${c4.x} ${c4.y}
              l ${c5.x} ${c5.y}
              A ${cr} ${cr} 0 0 1 ${c6.x} ${c6.y}
              A ${r + t} ${r + t} 0 ${large} 1 ${c7.x} ${c7.y}
              A ${cr} ${cr} 0 0 1 ${c8.x} ${c8.y}
              Z
          `}
          fill={props.color}
        />
      </Svg>
    </View>
  );
}

export default ArcButton;
