#将canvas获取的图片下载到本地

<h3 style='color:red'>1、概述</h3>

**普通图像（非必须）=> canvas图像 => 转为base64字符串 => 赋值给a标签 => 触发a标签的点击事件 => 下载**


<h3 style='color:red'>2、具体步骤</h3>


首先，你需要有一个canvas图像。

假如你有的仅仅是一个普通图片，请将其转为canvas图像（参考drawImage方法）

    这个图像可能是你自己利用canvas的画笔画的，
    也可能是你将一个图片通过drawImage方法绘制到canvas上，
    甚至是Video标签的截图，
    或者是将html通过某种方式（比如svg）转为了canvas图像
    但你得有，你可以通过以上方法获取。
    
其次，你需要拿到canvas这个dom，然后利用 ``canvas.toDataURL("image/png")`` 这样的方法，来获取对应格式的base64字符串。
可以通过修改参数，将其转为png或者其他格式的图片的字符串；

```
var canvas = document.querySelector('canvas');
var src = canvas.toDataURL("image/png");
```

第三，你需要在页面里有一个a标签，可以通过临时创建来获得，无需一定在dom树中。

然后将他的href属性设置为你之前获得的base64字符串，并且为其设置download属性（可以为空，作用是作为下载时的文件名）；

```
var dom = document.createElement("a");
dom.href = this.canvas.toDataURL("image/png");
dom.download = new Date().getTime() + ".png";
```

第四步，你需要触发这个a标签的点击事件，可以通过手动点击，或者js直接调用其click方法。

```
dom.click();
```

第五步，此时已经弹出了下载框，图片可以被下载到本地了。

<h3 style='color:red'>3、DEMO</h3>
附庸摄像头拍摄，并将拍摄到的图像下载到本地的源代码

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>将canvas获取的图片下载到本地</title>
</head>
<body>
<style>
    video, canvas {
        outline: 1px solid red;
    }
</style>
<p>这里通过拍照来获取你的图像，然后将其下载到本地。如果开启摄像头时有提示，请点击允许</p>
<button onclick="startVideo()">点击启用摄像头</button>
<button onclick="Shoot()">点击拍照</button>
<button onclick="download()">点击下载</button>
<br>
<p>左侧是摄像头当前拍摄中区域，右侧图片是已拍摄的图像，下载的内容是右边已拍摄的图像</p>
<video width="640" height="480" autoplay></video>
<canvas width="640" height="480"></canvas>

<script>
    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');

    //启用摄像头，开始拍摄
    function startVideo() {
        // video捕获摄像头画面
        navigator.mediaDevices.getUserMedia({
            video: true,
        }).then(success).catch(error)

        function success(stream) {
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }

        function error(err) {
            alert('video error: ' + err)
        }
    }


    function Shoot() {
        var context = canvas.getContext('2d');
        //把当前视频帧内容渲染到画布上
        context.drawImage(self.video, 0, 0, 640, 480);
    }

    //将图片下载到本地
    function download() {
        var dom = document.createElement("a");
        dom.href = this.canvas.toDataURL("image/png");
        dom.download = new Date().getTime() + ".png";
        dom.click();
    }
</script>

</body>
</html>
```