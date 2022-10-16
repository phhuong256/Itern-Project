import React, { Component } from "react";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight, Dimensions, TextInput, Animated, Image, PermissionsAndroid, ActivityIndicator, ScrollView, Platform } from "react-native";
import { _title } from "../../../../assets/resources/title-rss";
import AT_Dropdown from "../../components/AT_Dropdown";
import { _media } from "../../../../assets/resources/media-rss";
import { _message } from "../../../../assets/resources/message-rss";
import AT_Alert from "../../components/AT_Alert";
import { apiGetAnswerType, apiGetContentExtend, updateUserAnswer, getArrayImage } from "../../../services/redux/apis/apiContent007";
import AsyncStorage from "@react-native-community/async-storage";
import { _nameStorage } from "../../../../assets/resources/nameStorage-rss";
import AT_MessageError from "../../components/AT_MessageError";
import _styles from "../../../../assets/css/styles";
import AT_TextInput from "../../components/AT_TextInput";
//ADD-START 2022/08/22 ThanhKV #5623_5624_5625 コンテンツ表示_出欠確認機能見直し
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ImageViewer from "react-native-image-zoom-viewer";
import iconDownload from "../../../../assets/image/download.png";
import RNFetchBlob from "rn-fetch-blob";
import Moment from "moment";
import DeviceInfo from "react-native-device-info";
import { WebView } from "react-native-webview";
//ADD-END 2022/08/22 ThanhKV
//ADD-START 2022/09/21 ThanhKV 5837 sfx-mobile_コンテンツ表示[conType007]_承認者設定
import AT_DropdownBirthDay from "../../components/AT_DropdownBirthDay";
import AT_BaseDropdown from "../../components/AT_BaseDropdown";
//ADD-END 2022/09/21 ThanhKV

let { width, height } = Dimensions.get("window");
let percentHeight = height / _media.design.heightDesign;
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const defaultData = {
  name: "",
  email: "",
  answer_type: "",
  comment: "",
  join_type: "01",
  represent_user: 0,
};
//ADD-START 2022/08/22 ThanhKV #5623_5624_5625 コンテンツ表示_出欠確認機能見直し
/**
 * Animation hidden delete button of Image
 */
class FadeInView extends React.Component {
  state = { fadeAnim: new Animated.Value(0) };

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View style={{ opacity: this.state.fadeAnim }}>
        {this.props.children}
      </Animated.View>
    );
  }
}
//ADD-END 2022/08/22 ThanhKV

export default class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choices: [],
      isLoadApiChoice: false,
      isLoadApiExternal: false,
      user: {},

      inputWidthDelete: 0,
      inputWidthName: 0,
      inputWidthEmail: 0,
      isCalculated: true,

      isInvited: false,
      choiceInfo: {},
      //ADD-START 2022/08/22 ThanhKV #5623_5624_5625 コンテンツ表示_出欠確認機能見直し
      content: {},
      photo_url_array: [],
      showOriginalImage: false,
      previewFile: false,
      indexImage: 0,
      CurrentUrl: "",
      isLoadingWebview: true,
      isLoadingReload: false,
      jsEm: `
      window.ReactNativeWebView.postMessage(document.body.innerHTML);
      true;
      `,
      urlEm: "",
      inputWidth: 0,
      //ADD-END 2022/08/22 ThanhKV
      listUserInvite: [],

      inputWidthModal: 0,
      isCalculatedModal: true,

      modalVisible: false,
      dataModal: { ...defaultData },
      listError: [],
      errorName: "",
      errorEmail: "",
      errorComment: "",
      errorChoice: "",
      errorTelephone: "",
      errorPosition: "",
      isShowErr: false,
      selfEdit: false,
      editUser: false,
      isValid: true,
      currentEdit: "",
      isAdded: true,
      checkUser: true,
      checkValid: true,
      isChange: false,
      oldUser: [],
      checkAnswerType: [],
      selectIndex: -1,
      selectValue: _title.Common.default_choose_dropdown,
      withDropDown: 0,
      dataDropDown: [],
      answer_type: [],
      birthday: "",
      addUser: false,
      loadDropdown: [],
      birthdayAcc: "",
      listAdminInvite: [],
      listAnswer_Type: [],
    };
  }

  componentWillMount() {
    this.fetchData();
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  _resetModal() {
    this.setState({
      modalVisible: false,
      listError: [],
      errorName: "",
      errorEmail: "",
      errorComment: "",
      isShowErr: false,
      isValid: true,
      currentEdit: "",
      isAdded: true,
      errorChoice: "",
      addUser: false,
    });
  }
  _modalSubmit() {
    this.setState({ modalVisible: !this.state.modalVisible, checkUser: true }, () => {
      const { selfEdit, dataModal, listUserInvite, editUser, oldUser, listAdminInvite } = this.state;
      if (selfEdit) {
        let isChange_ = false;
        var listchoiceInfo = [];
        
        if (dataModal.answer_type != '' || (dataModal.comment != '' && dataModal.comment != undefined)) {
          isChange_ = true;
        }
        if (dataModal.answer_type.length >= 1 && typeof dataModal.answer_type[0].value != "undefined") {
          listchoiceInfo.push({"answer_type": dataModal.answer_type[0].value, "birthday": dataModal.birthday, "choice_id": dataModal.choice_id, "comment": dataModal.comment, 
          "email": dataModal.email, "id": dataModal.id, "name": dataModal.name, "position": dataModal.position, "telephone": dataModal.telephone});
          dataModal.answer_type.map((obj, page) => {
            this.state.listAnswer_Type.push({ id: obj.id, answer_type: obj.value });
          })
        } else if (typeof dataModal.answer_type[0].id == "undefined" || typeof dataModal.answer_type[0].value == "undefined") {
          listAdminInvite.map((obj, page) => {
            this.state.listAnswer_Type.push({ id: obj.id, answer_type: obj.answer_type });
          })
          listchoiceInfo.push({"answer_type": listAdminInvite[0].answer_type, "birthday": dataModal.birthday, "choice_id": dataModal.choice_id, "comment": dataModal.comment, 
          "email": dataModal.email, "id": dataModal.id, "name": dataModal.name, "position": dataModal.position, "telephone": dataModal.telephone});
        } else {
          listchoiceInfo.push({"answer_type": dataModal.answer_type[0].value, "birthday": dataModal.birthday, "choice_id": dataModal.choice_id, "comment": dataModal.comment, 
          "email": dataModal.email, "id": dataModal.id, "name": dataModal.name, "position": dataModal.position, "telephone": dataModal.telephone});
          listAdminInvite.map((obj, page) => {
            this.state.listAnswer_Type.push({ id: obj.id, answer_type: obj.answer_type });
          })
        }
        this.setState({ choiceInfo: listchoiceInfo[0], isChange: isChange_ }, () =>
          this._resetModal()
        );
      } else {
        if (editUser) {
          let isChange_ = false;
          if (dataModal.name != oldUser.name || dataModal.email != oldUser.email || dataModal.comment != oldUser.comment) {
            isChange_ = true;
          }
          if (dataModal.answer_type.length >= 1 && typeof dataModal.answer_type[0].value != "undefined") {
            listUserInvite.filter((value, key) => value.name == oldUser.name && value.position == oldUser.position && value.telephone == oldUser.telephone && value.comment == oldUser.comment).map((obj, page) => {
              obj.name = dataModal.name;
              obj.position = dataModal.position;
              obj.birthday = dataModal.birthday;
              obj.telephone = dataModal.telephone;
              obj.comment = dataModal.comment;
              obj.delete_flg = false;
              dataModal.answer_type.map((val, index) => {
                if (obj.id == val.id) {
                  obj.answer_type = val.value;
                }
              })
            })
          }
          else {
            listUserInvite.filter((value, key) => value.name == oldUser.name && value.position == oldUser.position && value.telephone == oldUser.telephone && value.comment == oldUser.comment).map((obj, page) => {
              obj.name = dataModal.name;
              obj.position = dataModal.position;
              obj.birthday = dataModal.birthday;
              obj.telephone = dataModal.telephone;
              obj.comment = dataModal.comment;
              obj.delete_flg = false;
            })
          }
          this.setState(
            {
              isChange: isChange_,
              listUserInvite: listUserInvite,
            },
            () => this._resetModal()
          );
        } else {
          dataModal.answer_type.map((obj, page) => {
            delete dataModal.answer_type;
            listUserInvite.push({ ...dataModal, answer_type: obj.value, choice_id: obj.id, delete_flg: false })
          })
          if (this.state.choiceInfo.answer_type == null && listUserInvite.length == 0) {
            this.setState({ listUserInvite, loadDropdown: listUserInvite, isChange: true, checkValid: false }, () => this._resetModal());
          } else {
            this.setState({ listUserInvite, loadDropdown: listUserInvite, isChange: true, }, () => this._resetModal());
          }
        }
      }
    });
  }
  _addUser() {
    const defaultModal = { ...defaultData, represent_user: this.state.user.id };
    this.setState(
      {
        selfEdit: false,
        dataModal: defaultModal,
        isValid: false,
        isShowErr: false,
        listError: [],
        editUser: false,
        isAdded: false,
        addUser: true,
      },
      () => {
        this.setModalVisible(true);
      }
    );
  }
  _editUser(user, key) {
    this.setState(
      {
        selfEdit: false,
        dataModal: user,
        oldUser: user,
        isValid: true,
        isShowErr: false,
        listError: [],
        editUser: true,
        currentEdit: key,
        isAdded: false,
      },
      () => {
        this.setModalVisible(true);
      }
    );

  }
  _editSelf(item) {
    this.setState(
      {
        dataModal: item,
        isValid: this.state.choiceInfo.answer_type === null ? false : true,
        selfEdit: true,
        oldUser: item,
        isShowErr: false,
        listError: [],
        editUser: true,
        isAdded: false,
        checkValid: true,
      },
      () => this.setModalVisible(true)
    );
  }
  _submitUserAnswer() {
    const { content } = this.props;
    const { choiceInfo, user, selfEdit, dataModal } = this.state;
    let data = {
      answer_format: content.answer_format_code,
      content_id: content.id,
      choice_id: this.state.choiceId,
      email: choiceInfo.email || user.email,
      answer_type: this.state.listAnswer_Type,
      birthday: choiceInfo.birthday,
      position: choiceInfo.position,
      telephone: choiceInfo.telephone,
      comment: choiceInfo.comment || "",
      users: this.state.listUserInvite,
    };
    if (selfEdit) {
      data = {
        answer_format: content.answer_format_code,
        content_id: content.id,
        choice_id: this.state.choiceId,
        email: choiceInfo.email || user.email,
        answer_type: this.state.listAnswer_Type,
        birthday: choiceInfo.birthday,
        position: choiceInfo.position,
        telephone: choiceInfo.telephone,
        comment: choiceInfo.comment || "",
        users: this.state.listUserInvite,
      };
    }
    const deadline = Moment(content.respone_deadline).utcOffset(9).format("YYYYMMDDHHmm");
    let getCurrentDate = this.getDateTimeNow();
    if (deadline < getCurrentDate) {
      this.refs.AlertNoRenew.alert(true);
    }
    else {
      updateUserAnswer(this.state.user.access_token, data).then((res) => {
        this.setState({ isChange: false }, () => this.refs.AlertSuccess.alert(true))

      });
    }
  }
  fetchData = async () => {
    const { token, content } = this.props;
    //ADD-START 2022/08/22 ThanhKV #5623_5624_5625 コンテンツ表示_出欠確認機能見直し
    const deadline = Moment(content.respone_deadline).utcOffset(9).format("YYYYMMDDHHmm");
    let getCurrentDate = this.getDateTimeNow();
    if (deadline < getCurrentDate) {
      this.setState({ isAdded: false });
    }
    await getArrayImage(token, content.id).then(
      (response) => {
        this.setState({ photo_url_array: response.photo_url_array, content: content })
      }
    );
    //ADD-END 2022/08/22 ThanhKV
    await apiGetAnswerType(token, content.answer_format_code).then(
      (response) => {
        // 出欠選択肢ソート
        response.data.sort(function (a, b) {
          return a.code - b.code;
        })
        const list = response.data.map((item) => {
          return { text: item.name, value: item.code };
        });
        // プルダウンData設定
        list.unshift({ text: _title.content007.choose, value: "" });
        this.setState({ choices: list }, () =>
          this.setState({ isLoadApiChoice: true })
        );
      }
    );
    await AsyncStorage.getItem(_nameStorage.AccountUser, (err, result) => {
      if (result != null && result != "null") {
        let data = JSON.parse(result);
        if (
          (data.access_token != undefined || data.access_token != null) &&
          (data.id != undefined || data.id != null)
        ) {
          this.setState({ birthdayAcc: data.birthday, user: data }, () => {
            apiGetContentExtend(data, content.id, content.contents_type).then(
              (res) => {
                const choice = res[0];
                if (choice.user) {
                  if (choice.user[0].answer_type == null) {
                    this.setState({ checkUser: false });
                  }
                  res.map((obj, page) => {
                    obj.user.map((value, index) => {
                      if (data.email == value.email) {
                        this.state.listAdminInvite.push(value);
                      }
                      this.state.loadDropdown.push(value);
                      if (value.answer_type != null && value.represent_user) {
                        this.state.listUserInvite.push(value);
                      }
                    })
                  })
                  this.setState({
                    checkAnswerType: res,
                    choiceId: choice.id,
                    choiceInfo:
                      choice.user.find((item) => data.email === item.email) ||
                      {},
                  }, () => this._getData(this.state.choices, ""));
                } else {
                  this.setState({ choiceId: choice.id, checkUser: false });
                }
                this.setState(
                  { isInvited: true, isLoadApiExternal: true },
                  () => this.props.changeInvite(true)
                );
              }
            );
          });
        }
      }
    });
  };

  getDateTimeNow() {
    let date = new Date().getDate();
    if (date.toString().length < 2) {
      date = '0' + date.toString();
    }
    let month = new Date().getMonth() + 1;
    if (month.toString().length < 2) {
      month = '0' + month.toString();
    }
    let year = new Date().getFullYear();
    let hours = new Date().getHours();
    if (hours.toString().length < 2) {
      hours = '0' + hours.toString();
    }
    let minute = new Date().getMinutes();
    if (minute.toString().length < 2) {
      minute = '0' + minute.toString();
    }
    let setCurrentDate = year.toString() + month.toString() + date.toString() + hours.toString() + minute.toString();
    return setCurrentDate;
  }

  _rssConstants = () => {
    return _media;
  };
  _cssStyles = () => {
    return _styles;
  };
  _rssTitles = () => {
    return _title;
  };
  _rssMessages = () => {
    return _message;
  };
  calculateWidth(event) {
    const wInput = event.nativeEvent.layout.width;
    if (this.state.inputWidthName === 0 && this.state.isCalculated) {
      this.setState({
        inputWidth: 0.98 * wInput,
        inputWidthDelete: 0.2 * wInput,
        inputWidthName: 0.45 * wInput,
        inputWidthEmail: 0.35 * wInput,
        isCalculated: false,
      });
    }
  }
  calculateWidthModal(event) {
    const wInput = event.nativeEvent.layout.width;
    if (this.state.inputWidthModal === 0 && this.state.isCalculatedModal) {
      this.setState({
        inputWidthModal: 0.5 * wInput,
        isCalculatedModal: false,
        withDropDown: 0.92 * wInput
      });
    }
  }
  getNameChoiceByValue(value) {
    const { choices } = this.state;
    if (choices.length === 0) return;
    value = value || "";
    let result = choices.find((item) => item.value == value);
    if (result.value == "") {
      return result.text;
    } else {
      return "回答済み";
    }
  }
  getNameMultiChoiceByValue(value) {
    let count = 0;
    var listUser = this.state.listUserInvite;
    listUser.map((obj, page) => {
      if (obj.name == value.name && obj.email == value.email && obj.position == value.position && obj.comment == value.comment && obj.telephone == value.telephone) {
        count++;
      }
    })
    if (count == 1) {
      value = value.answer_type;
      const { choices } = this.state;
      if (choices.length === 0)
        return;
      value = value || "";
      let result = choices.find((item) => item.value == value);
      if (result) {
        return "回答済み";
      } else {
        return "";
      }
    }
    else {
      return "回答済み";
    }
  }
  _checkTelephoneFormat = (phone) => {
    let regex = /^[0-9\b]+$/;
    return regex.test(phone);
  }
  _checkValidate() {
    const { errorName, errorPosition, dataModal, errorChoice, errorTelephone } = this.state;
    if (!this.state.selfEdit) {
      let listError = [];
      if (errorName != "") listError.push(errorName);
      if (errorPosition != "") listError.push(errorPosition);
      if (errorChoice != "") listError.push(errorChoice);
      if (errorTelephone != "") listError.push(errorTelephone);
      if (!this._checkTelephoneFormat(dataModal.telephone) && dataModal.telephone != null && dataModal.telephone != "") {
        listError.push("電話番号には半角数字のみを入力してください");
        this.setState({ listError });
      }
      else {
        this.setState({ listError: [] });
      }
      if (!this._checkTelephoneFormat(dataModal.telephone) || this.state.checkAnswerType.length !== dataModal.answer_type.length) {
        this.setState({ isValid: false });
      }
      else {
        this.setState({
          isValid:
            listError.length === 0 &&
            dataModal.name != "" &&
            dataModal.position != "" &&
            dataModal.telephone != "",
          listError,
        });
      }
      if (!this.state.addUser) {
        if (dataModal.answer_type.length >= 1) {
          this.setState({ isValid: true });
        }
        for (let i = 0; i < dataModal.answer_type.length; i++) {
          if (dataModal.answer_type[i].value == "") {
            this.setState({ isValid: false });
            break;
          }
        }
      }
    }
    else {
      if (dataModal.answer_type != null) {
        if (dataModal.answer_type.length > 0) {
          this.setState({ isValid: true });
        }
      }
    }
  }

  //ADD-START 2022/08/22 ThanhKV #5623_5624_5625 コンテンツ表示_出欠確認機能見直し
  checkFileType = (src, type) => {
    if (!src) return true;
    return src.indexOf(`.${type}`) > -1;
  };

  _onClickFile = (obj, page) => {
    if (this.checkFileType(obj, "png") || this.checkFileType(obj, "jpg")) {
      this.setState({ showOriginalImage: true, indexImage: page });
    } else {
      this.setState({
        urlEm: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(obj)}`,
        previewFile: true,
        indexImage: page,
        isLoadingWebview: true,
      });
    }
  };

  /**
   * Request permission save image in local storage
   * @param {*} url link image
   */
  async requestPermission(url) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this._onSaveImage(url);
      }
    } catch (err) {
      console.warn("err");
    }
  }

  /**
   * Handle download image from server
   */
  _onSaveImage = (url) => {
    const PictureDir =
      Platform.OS === "android"
        ? RNFetchBlob.fs.dirs.PictureDir
        : RNFetchBlob.fs.dirs.DocumentDir;
    var newPath = `image_${(Math.random() * 100000) | 0}.jpg`;

    if (Platform.OS === "android") {
      RNFetchBlob.fetch("GET", url)
        .then((response) => {
          let base64Str = response.data;
          let imageLocation = PictureDir + "/" + newPath;

          RNFetchBlob.fs.writeFile(imageLocation, base64Str, "base64");
          RNFetchBlob.fs
            .scanFile([
              { path: imageLocation, mime: "image/png, image/jpeg, image/jpg" },
            ])
            .then((res) => this.refs.AlertSuccess.alert(true))
            .catch((err) => this.refs.AlertFail.alert(true));
        })
        .catch((err) => this.refs.AlertFail.alert(true));
    } else {
      CameraRoll.saveToCameraRoll(url).then(
        Alert.alert("", this._rssTitles().MB220.download_success)
      );
    }
  };

  /**
  * Handle download file from server
  */
  checkPermission = async (url, fileName) => {
    if (Platform.OS === 'ios') {
      this.downloadFileIos(url, fileName);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.downloadFile(url, fileName);
        } else {
          this.refs.AlertFail.alert(true);
        }
      } catch (err) {
        this.refs.AlertFail.alert(true);
      }
    }
  };

  downloadFileIos = async (fileUrl, fileName) => {
    let appendExt;
    if (this.checkFileType(fileUrl, "png")) {
      appendExt = 'png'
    }
    else if (this.checkFileType(fileUrl, "jpg")) {
      appendExt = 'jpg'
    }
    else if (this.checkFileType(fileUrl, "xlsx")) {
      appendExt = 'xlsx'
    }
    else if (this.checkFileType(fileUrl, "docx")) {
      appendExt = 'docx'
    }
    else if (this.checkFileType(fileUrl, "pdf")) {
      appendExt = 'pdf'
    }

    const { dirs: { DownloadDir, DocumentDir } } = RNFetchBlob.fs;
    const { config } = RNFetchBlob;
    const isIOS = Platform.OS == "ios";
    const aPath = Platform.select({ ios: DocumentDir, android: DownloadDir });
    const fPath = aPath + '/' + fileName;

    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        appendExt: appendExt,
        notification: true,
      },
    });

    if (isIOS) {
      config(configOptions)
        .fetch('GET', fileUrl)
        .then(res => {
          setTimeout(() => {
            // RNFetchBlob.ios.previewDocument('file://' + res.path());
            RNFetchBlob.ios.openDocument(res.data);
          }, 300);

        })
        .catch(errorMessage => {
        });
    }
  };

  downloadFile = (url, fileName) => {
    let FILE_URL = url;
    let file_ext = this.getFileExtention(FILE_URL);
    file_ext = '.' + file_ext[0];

    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir + '/' + fileName,
        file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
      });
  };

  getFileExtention = fileUrl => {
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec(fileUrl) : undefined;
  };

  _onLoadEnd = () => {
    setTimeout(() => this.setState({ isLoadingWebview: false }), 1000);
  };

  /**
   * Set margin top of delete button
   */
  detectIphoneX = () => {
    if (Platform.OS === "ios") {
      return DeviceInfo.getModel() === "iPhone X" ||
        DeviceInfo.getModel() === "iPhone XS" ||
        DeviceInfo.getModel() === "iPhone XS Max" ||
        DeviceInfo.getModel() === "iPhone XR"
        ? 30
        : 20;
    } else return 10;
  };
  //ADD-END 2022/08/22 ThanhKV

  _getData(source, defaultValue) {
    let dt = source.map((e, i) => {
      return e.text;
    })
    this.setState({ dataDropDown: dt });
    if (typeof defaultValue != "undefined") {
      source.map((e, i) => {
        if (e.value == defaultValue) {
          this.setState({ selectIndex: i, selectValue: e.text });
          return;
        }
      })
    }
  }

  _getDataLoadDropDown(value) {
    let result;
    if (this.state.addUser || value == "") {
      result = this.state.choices[0].text;
      return result;
    }
    else {
      result = this.state.choices.find((item) => item.value == value);
      return result.text;
    }
  }

  getvalueDropDown(id, value) {
    let error = "";
    if (value === "") {
      error = this._rssTitles().Attendance.error_choice;
    } else {
      error = "";
    }
    let answertype = [];
    answertype = this.state.answer_type;
    if (answertype.length > 0) {
      answertype.map((obj, page) => {
        if (obj.id == id) {
          answertype.splice(page, 1);
        }
      })
    }
    answertype.push({ id, value });
    this.setState(
      {
        errorChoice: error,
        answer_type: answertype,
        dataModal: { ...this.state.dataModal, answer_type: answertype },
        isShowErr: true,
      },
      () => this._checkValidate()
    );
  }

  render() {
    let { required_asterisk_small } = this._cssStyles();

    let optionAlertNoRenew = {
      lock: false,
      content: "回答期限が過ぎているため更新できません",
      buttonConfirm: [{
        text: this._rssTitles().Common.btn_ok,
        onPress: () => {
          this.refs.AlertNoRenew.alert(false);
          this.props.navigation.navigate("MB020Page")
        }
      }]
    };

    //ADD-START 2022/08/22 ThanhKV #5623_5624_5625 コンテンツ表示_出欠確認機能見直し
    let styleBtnClose = {
      position: "absolute",
      top: this.detectIphoneX(),
      right: 10,
      padding: 15,
      zIndex: 1,
    };

    let optionIcon = {
      type: this._rssConstants().icon.FontAwesome,
      size: this._rssConstants().fontSize.supperBigSize,
      color: this._rssConstants().colors.whiteColor,
      name: "close",
    };

    let percent = this._rssConstants().device.height / this._rssConstants().design.heightDesign;

    let optionAlertFail = {
      lock: false,
      content: this._rssTitles().MB220.download_fail,
      buttonConfirm: [
        {
          text: this._rssTitles().Common.btn_ok,
          onPress: () => this.refs.AlertFail.alert(false),
        },
      ],
    };

    let images = [];
    if (this.state.content.photo_url_array != undefined) {
      for (let i = 1; i < this.state.content.photo_url_array.length; i++) {
        images.push({ url: this.state.content.photo_url_array[i] });
      }
    }
    //ADD-END 2022/08/22 ThanhKV

    let optionIconModal = {
      type: this._rssConstants().icon.Ionicons,
      size: this._rssConstants().fontSize.biggestSize,
      color: this._rssConstants().colors.thirdTextColor,
      name: "md-close",
    };
    // for modal
    let optionTextInputName = {
      name: this._rssTitles().Attendance.name,
      placeholder: this._rssTitles().Common.input,
      value: this.state.dataModal.name,
      space: false,
      style: { borderWidth: 1, borderColor: _media.colors.thirdTextColor },
      removeFlex: true,
      onChangeText: (value, error) =>
        this.setState(
          {
            dataModal: { ...this.state.dataModal, name: value },
            errorName: error,
            isShowErr: true,
          },
          () => this._checkValidate()
        ),
      validate: { required: true, maxlength: 300 },
      returnKeyType: "next",
    };
    //ADD-START 2022/09/21 ThanhKV 5837 sfx-mobile_コンテンツ表示[conType007]_承認者設定
    let optionTextInputPosition = {
      placeholder: this._rssTitles().Common.input,
      value: this.state.dataModal.position,
      space: false,
      style: { borderWidth: 1, borderColor: _media.colors.thirdTextColor },
      removeFlex: true,
      onChangeText: (value, error) =>
        this.setState(
          {
            dataModal: { ...this.state.dataModal, position: value },
            errorPosition: error,
            isShowErr: true,
          },
          () => this._checkValidate()
        ),
      validate: { required: true, maxlength: 30 },
      returnKeyType: "next",
    };
    let optionTextInputTelephone = {
      placeholder: this._rssTitles().Common.input,
      value: this.state.dataModal.telephone,
      space: false,
      style: { borderWidth: 1, borderColor: _media.colors.thirdTextColor },
      removeFlex: true,
      onChangeText: (value, error) =>
        this.setState(
          {
            dataModal: { ...this.state.dataModal, telephone: value },
            errorTelephone: error,
            isShowErr: true,
          },
          () => this._checkValidate()
        ),
      validate: { required: true, maxlength: 20 },
      returnKeyType: "next",
    };
    let optionBirthDay = {
      date: this.state.selfEdit && this.state.dataModal.birthday == undefined ? this.state.birthdayAcc : this.state.dataModal.birthday,
      num: 4,
      width: this.state.inputWidth,
      onChange: (value, error) => {
        this.setState({ dataModal: { ...this.state.dataModal, birthday: value }, birthdayErr: error, birthday: error === '' ? value : null, isShowErr: true }, () => this._checkValidate()
        )
      }
    };
    //ADD-END 2022/09/21 ThanhKV
    let optionError = { data: [this.state.listError] };
    const { modalVisible } = this.state;
    // end modal
    let optionAlertSuccess = {
      lock: true,
      content: this._rssMessages().Attendance.success,
      buttonConfirm: [
        {
          text: this._rssTitles().Attendance.btn_modal,
          onPress: () => this.refs.AlertSuccess.alert(false),
        },
      ],
    };

    return (
      <View >
        {this.state.isInvited && (
          <View >
            {this.state.isLoadApiChoice && this.state.isLoadApiExternal && (
              <View onLayout={(event) => { this.calculateWidth(event) }} style={{ borderTop: 1, borderBottom: 0, borderRight: 1, borderLeft: 1, borderColor: "#2285be" }}>
                {!this.state.isCalculated && (
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ alignItems: 'center', padding: 8 }}>
                      <Text style={styles.textHeader}>ご参加者の出欠登録</Text>
                    </View>
                    <View style={{ backgroundColor: '#FFF', flexDirection: 'column' }}>
                      <View style={{ padding: 8 }}>
                        <Text style={styles.subText}>出欠を変更するには、自分の出欠をタップしてください。 </Text>
                      </View>
                      <View style={{ flexDirection: 'column', marginHorizontal: '3%', width: '94%' }}>

                        {/* 出欠表ヘッダー */}
                        <View style={{ flexDirection: "row", width: '100%' }}>
                          <View style={{ width: this.state.inputWidthDelete, width: '21%' }}></View>
                          <View style={[{ width: this.state.inputWidthName, width: '47%' }, styles.borderr_]}>
                            <Text style={styles.textTableHeader}>氏名</Text>
                          </View>
                          <View style={[{ width: this.state.inputWidthEmail, width: '32%' }, styles.borderr_]}>
                            <Text style={styles.textTableHeader}>ご出欠</Text>
                          </View>
                        </View>

                        {/* 本人出欠 */}
                        {Object.keys(this.state.choiceInfo).length > 0 && (
                          <View style={{ flexDirection: "row", width: '100%', backgroundColor: '#EEEEEE' }}>
                            <View
                              style={[{ width: this.state.inputWidthDelete, width: '21%' }, styles.borderr_]}>
                            </View>
                            <View style={[{ width: this.state.inputWidthName, width: '47%' }, styles.borderr_]} >
                              <Text style={styles.text}>
                                {this.state.choiceInfo.name}
                              </Text>
                            </View>
                            <View style={{ width: this.state.inputWidthName, width: '32%', justifyContent: 'center', height: "auto", alignItems: 'center', borderWidth: 1, borderColor: '#FFF' }} >
                              <TouchableHighlight disabled={!this.state.isAdded} onPress={() => this._editSelf(this.state.choiceInfo)}>
                                <Text style={[styles.attandance_status_text]}>
                                  {this.getNameChoiceByValue(
                                    this.state.choiceInfo.answer_type
                                  )}
                                </Text>
                              </TouchableHighlight>
                            </View>
                          </View>
                        )}

                        {/* 代理人出欠 */}
                        {this.state.listUserInvite.filter((value, index, self) => self.findIndex(t => (t.name === value.name && t.position === value.position && t.telephone === value.telephone
                          && t.join_type === value.join_type && t.email === value.email && t.comment === value.comment && t.answer_type != null && t.represent_user != null)) === index).map((item, key) => (
                            <View style={{ backgroundColor: '#EEEEEE', flexDirection: "row", width: '100%' }}>
                              <View style={[{ width: this.state.inputWidthDelete, width: '21%', backgroundColor: "#EEEEEE", justifyContent: 'center', borderWidth: 1, borderColor: '#FFF' }]}>
                                <TouchableHighlight
                                  disabled={!this.state.isAdded}
                                  key={key + "invite"}
                                  onPress={() => {
                                    this.setState({
                                      isChange: true,
                                      listUserInvite:
                                        this.state.listUserInvite.filter(
                                          (value, keyEl) => keyEl !== key && value.telephone !== item.telephone
                                        ),
                                    });
                                  }}
                                >
                                  <Text state={[styles.linkText]} style={{ color: '#888888', textDecorationLine: 'underline', textAlign: 'center' }}>[削除]</Text>
                                </TouchableHighlight>
                              </View>
                              <View style={[{ width: this.state.inputWidthName, width: '47%' }, styles.borderr_]} >
                                <Text style={styles.text}>{item.name}</Text>
                              </View>
                              <View style={[styles.attandance_status_sub_text]}>
                                <TouchableHighlight disabled={!this.state.isAdded} onPress={() => this._editUser(item, key)}>
                                  <Text style={[styles.text, { color: _media.colors.primaryTextColor, textDecorationLine: 'underline' }]}>
                                    {this.getNameMultiChoiceByValue(item)}
                                  </Text>
                                </TouchableHighlight>
                              </View>
                            </View>
                          ))}
                      </View>
                      <View style={{ paddingVertical: '2%', alignItems: 'flex-end' }}>
                        <TouchableHighlight disabled={!this.state.isAdded} style={!this.state.isAdded ? styles.btnAddAttendance_disable : styles.btnAddAttendance} onPress={() => this._addUser()}>
                          <Text style={[styles.textTableHeader, { fontWeight: 'bold', color: _media.colors.blackColor }]}>
                            + 参加者を追加
                          </Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: '5%', marginBottom: '6%' }} >
                      {this.state.isChange == true &&
                        <Text style={styles.textWrning}>
                          ＊登録は確定されていません
                        </Text>
                      }
                    </View>

                    {/* ADD-START 2022/08/22 ThanhKV #5623_5624_5625 コンテンツ表示_出欠確認機能見直し */}
                    {
                      (this.state.content.photo_url_array[1] !== null || this.state.content.photo_url_array[2] !== null || this.state.content.photo_url_array[3] !== null)
                      && <View style={{ flexDirection: 'column', marginHorizontal: '3%', width: '100%' }}>
                        <View style={{ flexDirection: "row", width: '100%', backgroundColor: '#1E90FF' }}>
                          <View style={[{ width: this.state.inputWidthName, width: '60%', marginLeft: '-3%', backgroundColor: '#1E90FF' }, styles.borderTableDownload]}>
                            <Text style={styles.textTableDownloadHeader}>ファイル名</Text>
                          </View>
                          <View style={[{ width: this.state.inputWidthName, width: '27%' }, styles.borderTableDownload]}>
                            <Text style={styles.textTableDownloadHeader}>プレビュー</Text>
                          </View>
                          <View style={[{ width: this.state.inputWidthEmail, width: '13%' }, styles.borderTableDownload]}>
                            <Text style={styles.textTableDownloadHeader}>DL</Text>
                          </View>
                        </View>

                        {
                          this.state.content.photo_url_array.length > 0 &&
                          this.state.content.photo_url_array.filter((value, index) => index !== 0 && index <= 3).map((obj, page) => {
                            const fileName = this.state.photo_url_array && this.state.photo_url_array.find((e, i) => i === page + 1);
                            const _fileName = fileName && fileName.substring(fileName.lastIndexOf('/') + 1);
                            return (
                              obj !== null && <View style={{ flexDirection: "row", width: '100%', backgroundColor: '#EEEEEE' }}>
                                <View style={[{ width: this.state.inputWidthName, width: '60%', marginLeft: '-3%', display: 'flex', justifyContent: 'center' }, styles.borderTableDownload]} >
                                  <Text style={[styles.borderTableText]} numberOfLines={1}>
                                    {_fileName}
                                  </Text>
                                </View>
                                <View style={[{ width: this.state.inputWidthName, width: '27%' }, styles.borderTableDownload]} >
                                  <TouchableOpacity
                                    key={page}
                                    onPress={() => {
                                      this.setState(
                                        {
                                          urlEm: `https://drive.google.com/viewerng/viewer?url=${encodeURIComponent(
                                            obj
                                          )}&embedded=true`,
                                        },
                                        () => this._onClickFile(obj, page)
                                      );
                                    }}
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                  >
                                    {
                                      obj !== null && <Text style={styles.borderTableOpenText}>開く</Text>
                                    }
                                  </TouchableOpacity>
                                </View>
                                <View style={{ width: this.state.inputWidthEmail, width: '13%', justifyContent: 'center', height: "auto", alignItems: 'center', borderWidth: 1, borderColor: '#A9A9A9' }} >
                                  <TouchableOpacity
                                    key={page}
                                    onPress={() => {
                                      this.checkPermission(obj, _fileName)
                                    }}
                                  >
                                    {
                                      <View style={{ flexDirection: "row", justifyContent: 'center', height: 30, width: 30, marginTop: Platform.OS == "ios" ? 15 : 0 }}>
                                        <Text>
                                          <Image
                                            source={iconDownload}
                                            style={{
                                              resizeMode: 'cover',
                                              width: 20,
                                              height: 20
                                            }}
                                          />
                                        </Text>
                                      </View>
                                    }
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )
                          })
                        }
                      </View>
                    }
                    {/* ADD-END 2022/08/22 ThanhKV */}

                    <TouchableHighlight
                      disabled={!this.state.isAdded || !this.state.checkUser || !this.state.checkValid}
                      style={[
                        styles.btnSubmit,
                        (this.state.isValid && this.state.isAdded && this.state.checkUser && this.state.checkValid)
                          ? styles.btn_submit
                          : styles.btn_submit_,
                      ]}
                      onPress={() => this._submitUserAnswer()}
                    >
                      <Text style={styles.textStyle}>
                        {this._rssTitles().Attendance.btn_submit}
                      </Text>
                    </TouchableHighlight>
                  </View>
                )}
              </View>
            )}

            {/* ADD-START 2022/08/22 ThanhKV #5623_5624_5625 コンテンツ表示_出欠確認機能見直し */}
            <Modal
              visible={this.state.showOriginalImage}
              transparent={true}
              onRequestClose={() => {
                this.setState({ showOriginalImage: false });
              }}
            >
              <TouchableOpacity
                style={styleBtnClose}
                onPress={() => {
                  this.setState({ showOriginalImage: false });
                }}
              >
                <FadeInView>
                  <FontAwesome {...optionIcon} />
                </FadeInView>
              </TouchableOpacity>
              <ImageViewer
                menuContext={{
                  saveToLocal: "画像を保存する",
                  cancel: "キャンセル",
                }}
                index={this.state.indexImage}
                saveToLocalByLongPress={true}
                loadingRender={() => (
                  <ActivityIndicator
                    style={{
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").height,
                    }}
                    size="large"
                    color="#fff"
                  />
                )}
                onSave={(url) =>
                  Platform.OS === "android"
                    ? this.requestPermission(url)
                    : this._onSaveImage(url)
                }
                imageUrls={images}
              />
            </Modal>
            {/* ADD-END 2022/08/22 ThanhKV */}

            <Modal
              visible={this.state.previewFile}
              transparent={true}
              onRequestClose={() => {
                this.setState({ previewFile: false });
              }}
            >
              <TouchableOpacity
                style={styleBtnClose}
                onPress={() => {
                  this.setState({ previewFile: false });
                }}
              >
                <FadeInView>
                  <FontAwesome {...optionIcon} color="black" />
                </FadeInView>
              </TouchableOpacity>

              <View style={{ flex: 1, overflow: "hidden" }}>
                {(this.state.isLoadingWebview ||
                  this.state.isLoadingReload) && (
                    <View style={this._cssStyles().loading}>
                      <ActivityIndicator size="large" color="#fff" />
                    </View>
                  )}
                <WebView
                  javaScriptEnabled={true}
                  injectedJavaScript={this.state.jsEm}
                  ref="WebViewRef"
                  source={{ uri: this.state.urlEm }}
                  mixedContentMode="always"
                  onLoad={() => this._onLoadEnd()}
                />
              </View>
            </Modal>

            <Modal
              backdropOpacity={0.5}
              style={{ position: "absolute", width: 0.9 * width, height: 0.8 * height, }}
              backdropColor={"rgba(0, 0, 0, 0.8)"}
              animationType="slide"
              transparent={true}
              isVisible={modalVisible}
            >
              <View style={[styles.centeredView]} >
                <View style={styles.modalView} onLayout={(event) => { this.calculateWidthModal(event); }}>
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingTop: '5%', paddingBottom: '5%' }}>
                    <Text style={{ color: '#000', fontSize: 16 }}>出欠登録</Text>
                    <TouchableOpacity onPress={() => { this._resetModal(); }}>
                      <Ionicons {...optionIconModal} />
                    </TouchableOpacity>
                  </View>
                  {!this.state.isCalculatedModal && (
                    <ScrollView>
                      <View>
                        <View style={styles.rowModal}>
                          <Text style={[{ width: this.state.inputWidthModal }, styles.text]}>氏名   <Text style={required_asterisk_small}>[必須]</Text></Text>
                        </View>
                        <View style={[styles.rowModal]}>
                          {this.state.selfEdit ? (
                            <View style={{ flex: 1, marginBottom: 20 }}>
                              <TextInput style={{ borderWidth: 1, borderColor: _media.colors.blackColor, fontWeight: 'bold', backgroundColor: '#808080', height: 40 * percentHeight }}
                                value={this.state.choiceInfo.name}
                                editable={false}
                              />
                            </View>
                          ) : (
                            <View style={{ flex: 1, marginBottom: 20 }}>
                              <AT_TextInput options={optionTextInputName} inputRef={(el) => (this.inputName = el)} />
                            </View>
                          )}
                        </View>

                        <View style={styles.rowModal}>
                          <Text style={[styles.text]}>役職   <Text style={required_asterisk_small}>[必須]</Text></Text>
                        </View>
                        <View style={[styles.rowModal]}>
                          {this.state.selfEdit ? (
                            <View style={{ flex: 1, marginBottom: 20 }}>
                              <AT_TextInput options={optionTextInputPosition} inputRef={(el) => (this.inputPosition = el)} />
                            </View>
                          ) : (
                            <View style={{ flex: 1, marginBottom: 20 }}>
                              <AT_TextInput options={optionTextInputPosition} inputRef={(el) => (this.inputPosition = el)} />
                            </View>
                          )}
                        </View>

                        <View style={styles.rowModal}>
                          <Text style={[styles.text]}>生年月日</Text>
                        </View>
                        <View style={[styles.rowModal]}>
                          {this.state.selfEdit ? (
                            <AT_DropdownBirthDay options={optionBirthDay} />
                          ) : (
                            <View style={{ flex: 1, marginBottom: 20 }}>
                              <AT_DropdownBirthDay options={optionBirthDay} />
                            </View>
                          )}
                        </View>

                        <View style={styles.rowModal}>
                          <Text style={[styles.text]}>電話番号   <Text style={required_asterisk_small}>[必須]</Text></Text>
                        </View>
                        <View style={[styles.rowModal]}>
                          {this.state.selfEdit ? (
                            <View style={{ flex: 1, marginBottom: 20 }}>
                              <AT_TextInput options={optionTextInputTelephone} inputRef={(el) => (this.inputTelephone = el)} />
                            </View>
                          ) : (
                            <View style={{ flex: 1, marginBottom: 20 }}>
                              <AT_TextInput options={optionTextInputTelephone} inputRef={(el) => (this.inputTelephone = el)} />
                            </View>
                          )}
                        </View>
                        <View style={styles.rowModal}>
                          <Text style={[styles.text]}>コメント </Text>
                        </View>
                        <View style={styles.textAreaContainer}>
                          <TextInput
                            style={styles.textArea}
                            underlineColorAndroid="transparent"
                            placeholder=""
                            placeholderTextColor="grey"
                            multiline={true}
                            onChangeText={(r) => {
                              let error = "";
                              if (r.length > 300) {
                                error = "コメントは300文字以内で入力してください";
                              }
                              this.setState(
                                {
                                  dataModal: { ...this.state.dataModal, comment: r },
                                  errorComment: error,
                                  isShowErr: true,
                                },
                                () => this._checkValidate()
                              );
                            }}
                            value={
                              this.state.dataModal.comment === "null" ? "" : this.state.dataModal.comment
                            }
                          />
                        </View>
                        <View style={{ padding: 5, marginTop: 5, marginBottom: 10 }}>
                          <AT_MessageError options={this.state.isShowErr ? optionError : []} />
                        </View>
                        {
                          this.state.addUser && this.state.checkAnswerType.length > 0 &&
                          this.state.checkAnswerType.map((obj, page) => {
                            return (
                              <View>
                                <View style={styles.rowModal}>
                                  <Text style={[{ width: this.state.inputWidthModal }, styles.textDropdown]}> {obj.title}</Text>
                                </View>
                                <View style={[styles.rowModal]}>
                                  <View style={{ flex: 1, marginBottom: 20 }}>
                                    <View style={{
                                      height: this._rssConstants().heightDropdow,
                                    }}>
                                      <AT_BaseDropdown
                                        ref="BaseDropdown"
                                        width={this.state.withDropDown}
                                        count={3}
                                        defaultIndex={this.state.selectIndex}
                                        defaultValue={this._getDataLoadDropDown(obj.user == null ? "" : obj.user[0].answer_type)}
                                        options={this.state.dataDropDown}
                                        onSelect={(idx, value) => {
                                          this.getvalueDropDown(obj.id, this.state.choices[idx].value);
                                        }}
                                      />
                                    </View>
                                  </View>
                                </View>
                              </View>
                            )
                          })
                        }
                        {
                          !this.state.addUser && this.state.loadDropdown.map((obj, page) => {
                            if (obj.name == this.state.oldUser.name) {
                              return (
                                <View>
                                  <View style={styles.rowModal}>
                                    <Text style={[{ width: this.state.inputWidthModal }, styles.textDropdown]}> {obj.title}</Text>
                                  </View>
                                  <View style={[styles.rowModal]}>
                                    <View style={{ flex: 1, marginBottom: 20 }}>
                                      <View style={{
                                        height: this._rssConstants().heightDropdow,
                                      }}>
                                        <AT_BaseDropdown
                                          ref="BaseDropdown"
                                          width={this.state.withDropDown}
                                          count={3}
                                          defaultIndex={this.state.selectIndex}
                                          defaultValue={this._getDataLoadDropDown(obj.answer_type ? obj.answer_type : "")}
                                          options={this.state.dataDropDown}
                                          onSelect={(idx, value) => {
                                            this.getvalueDropDown(obj.id, this.state.choices[idx].value);
                                          }}
                                        />
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              )
                            }
                          })
                        }
                      </View>
                    </ScrollView>
                  )}
                  <View>
                    <TouchableHighlight
                      disabled={!this.state.isValid}
                      style={this.state.isValid ? styles.btnSummitOk : styles.btnSummitOk_disable}
                      onPress={() => { this._modalSubmit() }}
                    >
                      <Text style={styles.textStyle}>
                        {this._rssTitles().Attendance.btn_modal}
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </Modal>
            <AT_Alert option={optionAlertSuccess} ref="AlertSuccess" />
            <AT_Alert option={optionAlertFail} ref="AlertFail" />
            <AT_Alert option={optionAlertNoRenew} ref="AlertNoRenew" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn_submit: {
    backgroundColor: _media.colors.primaryColor,
  },
  btn_submit_: {
    backgroundColor: _media.colors.grayBorderColor,
  },
  textAreaContainer: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
    height: "auto",
  },
  borderr_: {
    height: "auto",
    padding: 5,
    borderWidth: 1,
    borderColor: '#FFF'
  },
  textArea: {
    minHeight: 60,
    height: "auto",
    textAlignVertical: "top",
    maxHeight: 200,
  },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  textHeader: { color: _media.colors.primaryTextColor, fontSize: _media.fontSize.normalSize - 2, fontWeight: 'bold' },
  textTableHeader: {
    color: '#808080',
    fontSize: _media.fontSize.smallSize
  },
  textWrning: {
    color: _media.colors.redColor,
    fontSize: _media.fontSize.smallSize,
  },
  text: {
    color: _media.colors.primaryTextColor,
    fontSize: _media.fontSize.smallestSize,
    paddingBottom: '-2%',
    fontWeight: 'bold',
  },
  textDropdown: {
    color: _media.colors.whiteColor,
    fontSize: _media.fontSize.smallestSize,
    paddingBottom: '-2%',
    fontWeight: 'bold',
    backgroundColor: _media.colors.primaryTextColor,
    width: "100%"
  },
  attandance_status_text: {
    color: _media.colors.primaryTextColor,
    fontSize: _media.fontSize.smallestSize,
    textDecorationLine: 'underline',
  },
  attandance_status_sub_text: {
    width: '32%',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    textAlign: "center",
    borderWidth: 1,
    borderColor: '#FFF',
  },
  subText: {
    color: _media.colors.primaryTextColor,
    fontSize: _media.fontSize.smallestSize - 1,
    paddingLeft: '3%'
  },
  linkText: {
    color: _media.colors.blueColor,
    fontSize: _media.fontSize.smallestSize,
    textDecorationLine: "underline",
  },
  borderChoiceAddUser: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: _media.colors.blackColor,
    padding: 5,
  },
  borderChoiceNoUserInvite: {
    borderWidth: 1,
    borderColor: _media.colors.blackColor,
    padding: 5,
  },
  borderChoiceAddUserNoUserInvite: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: _media.colors.blackColor,
    padding: 5,
  },
  iconDelete: {
    width: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  boxHeader: {
    marginBottom: 7,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  // modal style start
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: width * 0.9,
    height: Platform.OS == 'ios' ? height * 0.7 : height * 0.9,
    flexDirection: "column",
    margin: 20,
    backgroundColor: "white",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  rowModal: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnSubmit: {
    justifyContent: "center",
    alignItems: "center",
    height: 44 * percentHeight,
    marginTop: 20
  },
  btnAddAttendance: {
    justifyContent: "center",
    alignItems: "center",
    margin: "3%",
    width: "94%",
    height: 40 * percentHeight,
    backgroundColor: _media.colors.thirdColor,
  },
  btnAddAttendance_disable: {
    justifyContent: "center",
    alignItems: "center",
    margin: "3%",
    width: "94%",
    height: 40 * percentHeight,
    backgroundColor: _media.colors.grayBorderColor,
  },
  textFilename: {
    color: '#00BFFF',
    fontWeight: 'bold',
  },
  btnSummitOk: {
    justifyContent: "center",
    alignItems: "center",
    margin: "3%",
    width: "94%",
    height: 40 * percentHeight,
    backgroundColor: _media.colors.primaryColor,
  },
  btnSummitOk_disable: {
    justifyContent: "center",
    alignItems: "center",
    margin: "3%",
    width: "94%",
    height: 40 * percentHeight,
    backgroundColor: _media.colors.grayBorderColor,
  },
  // end style modal
  icon_add: {
    paddingVertical: '2%'
  },
  textTableDownloadHeader: {
    color: '#FFFFFF',
    fontSize: _media.fontSize.smallSize,
    textAlign: "center",
  },
  borderTableDownload: {
    height: "auto",
    padding: 5,
    borderWidth: 1,
    borderColor: '#A9A9A9'
  },
  borderTableOpenText: {
    color: _media.colors.primaryTextColor,
    fontSize: _media.fontSize.smallestSize,
    textDecorationLine: "underline",
    textAlign: 'center',
    marginTop: '2%'
  },
  borderTableText: {
    color: _media.colors.primaryTextColor,
    fontSize: _media.fontSize.smallestSize,
  },
});