"use client";
import { Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";

const GLEvent = () => {
  const [msg1, setMsg1] = useState(false);
  const [msg2, setMsg2] = useState(false);
  const [msg3, setMsg3] = useState(false);
  const [msg4, setMsg4] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const sendMessage = () => {
    setMsg1(true);
    setTimeout(() => {
      setMsg2(true);
    }, 1500);
    setTimeout(() => {
      setMsg3(true);
    }, 3000);
    setTimeout(() => {
      setMsg4(true);
    }, 6000);
  };

  return (
    <>
      <div className="flex flex-col h-[80vh] bg-gray-100">
        {/* 主容器 - 电脑端两侧留白 */}
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full bg-white shadow-lg">
          <div
            className="flex justify-center items-center"
            style={{ padding: "20px 10px" }}
          >
            <h1
              className="text-2xl font-bold text-gray-800"
              style={{
                backgroundColor: "#E73412",
                color: "#fff",
                paddingLeft: "10px",
              }}
            >
              GL
            </h1>
            <h1
              className="text-2xl font-normal text-gray-800"
              style={{
                backgroundColor: "#E73412",
                color: "#fff",
                padding: "0 10px",
              }}
            >
              Events Chat
            </h1>
          </div>

          {/* 消息列表区域 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* 收到的消息 - 左侧 */}
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                <p className="text-sm">
                  This Exhibition is about Sports & Outdoor Trade Show, let me
                  know what are you interested in. For Example, Biking, Running,
                  Hiking, etc.
                </p>
              </div>
            </div>
            {/* 发送的消息 - 右侧 */}
            <div
              className="flex justify-end"
              style={{ display: msg1 ? "flex" : "none" }}
            >
              <div className="bg-green-500 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                <p className="text-sm">Biking</p>
              </div>
            </div>
            {/* 更多消息... */}
            <div
              className="flex justify-start"
              style={{ display: msg2 ? "flex" : "none" }}
            >
              <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                <p className="text-sm">
                  You can visit Decathlon in Booth 101 for more information.
                </p>
                {/* 这边会有个按钮，显示可以下载Decathlon的宣传单 ，样式根据已有的风格进行调整，去除默认的border*/}
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 1,
                    mr: 1,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  Download Brochure
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setShowMap(true)}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  Get Direction
                </Button>
              </div>
            </div>
            <div
              className="flex justify-start"
              style={{ display: msg3 ? "flex" : "none" }}
            >
              <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                <p className="text-sm">
                  You can visit Giant in Booth 105 for more information.
                </p>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 1,
                    mr: 1,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  Download Brochure
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setShowMap(true)}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  Get Direction
                </Button>
              </div>
            </div>
            <div
              className="flex justify-start"
              style={{ display: msg4 ? "flex" : "none" }}
            >
              <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                <p className="text-sm">
                  Another Exhibition you may intersted in about Biking in Next
                  Week in Shanghai.
                </p>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 1,
                    mr: 1,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  Get More Information
                </Button>
              </div>
            </div>
          </div>

          {/* 输入框区域 - 固定在底部 */}
          {/* 固定在底部，现在上面由menu 可能导致它不会显示在最下面，始终让这个输入框在最下面 */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                onClick={() => sendMessage()}
              >
                发送
              </button>
              <button></button>
            </div>
          </div>
          <Dialog
            open={showMap}
            onClose={() => setShowMap(false)}
            maxWidth={false}
            PaperProps={{
              sx: {
                width: "50vw",
                height: "60vh",
                margin: 0,
                maxWidth: "none",
                maxHeight: "none",
              },
            }}
          >
            <DialogContent sx={{ p: 0, height: "100%" }}>
              {/* 地图内容可以放在这里 */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-600">
                  <img
                    src="/map.png"
                    alt="Map"
                    className="max-w-full max-h-full object-contain"
                  />
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default GLEvent;
