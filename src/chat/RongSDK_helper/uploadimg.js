import UploadClient from './RongUploadImg/init'
function upload(_file, callback_) {
	var Rong = RongIMClient.getInstance();
	var url = "";
	var onConnected = function (im) {
		var urlItem = {
			//暂不做文件传输
			file: function (data) {
				var fileType = RongIMLib.FileType.FILE;
				im.getFileUrl(fileType, data.filename, data.name, {
					onSuccess: function (result) {
						data.downloadUrl = result.downloadUrl;
						url = result.downloadUrl;
						callback_(url)
					},
					onError: function (error) {
						console.log('getFileToken error:' + error);
					}
				});
			},
			image: function (data) {
				var fileType = RongIMLib.FileType.IMAGE;
				im.getFileUrl(fileType, data.filename, null, {
					onSuccess: function (result) {
						data.downloadUrl = result.downloadUrl;
						url = result.downloadUrl;
						callback_(url)
					},
					onError: function (error) {
						console.log('getFileToken error:' + error);
					}
				});
			}
		};
		var getFileUrl = function (data) {
			urlItem[data.fileType](data);
		};

		var getFileType = function (filename) {
			// 默认支持两种图片格式，可自行扩展
			var imageType = {
				'jpg': 1,
				'png': 2,
			};
			var index = filename.lastIndexOf('.') + 1,
				type = filename.substring(index);
			return type in imageType ? 'image' : 'file';
		};
		var callback = {
			onError: function (errorCode) {
				console.log(errorCode);
			},
			onProgress: function (loaded, total) {
				//var percent = Math.floor(loaded / total * 100);
				//传图片中完成度
			},
			onCompleted: function (data) {
				data.fileType = getFileType(data.name);
				getFileUrl(data);
			}
		};
		// 上传文件
		var config = {
			domain: 'http://upload.qiniu.com',
			fileType: RongIMLib.FileType.IMAGE,
			getToken: function (callback) {

				im.getFileToken(this.fileType, {
					onSuccess: function (data) {
						callback(data.token);
					},
					onError: function (error) {
						console.log('getFileToken error:' + error);
					}
				});
			}
		};
		var initType = {
			file: function (_file) {
				config.fileType = RongIMLib.FileType.FILE;
				UploadClient.initFile(config, function (uploadFile) {
					uploadFile.upload(_file, callback);
				});
			},
			image: function (_file) {
				UploadClient.initImage(config, function (uploadFile) {
					uploadFile.upload(_file, callback);
				});
			}
		};

		initType[getFileType(_file.name)](_file);
	}

	if (Rong) {
		onConnected(Rong)
	} else {
		console.log("连接失效")
	}
}
export default upload;
