import React from "react";
import _ from "lodash";
import RGL from "react-grid-layout";
import { WidthProvider } from "react-grid-layout/legacy";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

export default class ResizableHandles extends React.PureComponent {
  static defaultProps = {
    className: "bg-white/10 w-screen h-screen max-w-screen max-h-screen",
    items: 20,
    rowHeight: 30,
    onLayoutChange: function () {},
    cols: 12,
  };

  constructor(props: any) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function (i) {
      return (
        <div className="b-2 bg-amber-50 m-2" key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

    return _.map(new Array(p.items), function (item, i) {
      const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString(),
        resizeHandles: availableHandles,
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}
