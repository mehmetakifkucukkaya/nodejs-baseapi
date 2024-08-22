class Response {
  constructor(data = null, message = null) {
    this.data = data;
    this.message = message;
  }

  //* Success response
  succes(res) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ?? 'İşlem Başarılı',
    });
  }

  //* Created response
  created(res) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ?? 'İşlem Başarılı',
    });
  }

  //* API - Server Error
  error500(res) {
    return res.status(500).json({
      succes: false,
      data: this.data,
      message: this.message ?? 'İşlem Başarısız!',
    });
  }

  //* Bad Request
  error400(res) {
    return res.status(400).json({
      succes: false,
      data: this.data,
      message: this.message ?? 'İşlem Başarısısz!',
    });
  }

  //* Unauthorized
  error401(res) {
    return res.status(401).json({
      succes: false,
      data: this.data,
      message: this.message ?? 'Lütfen oturum açınız!',
    });
  }

  //* Unknown Hata
  error404(res) {
    return res.status(404).json({
      succes: false,
      data: this.data,
      message: this.message ?? 'İşlem Başarısız!',
    });
  }

  //* Too Many Requests
  error429(res) {
    return res.status(429).json({
      succes: false,
      data: this.data,
      message: this.message ?? 'Çok fazla istek gönderdiniz. Lütfen bekleyin!',
    });
  }
}

module.exports = Response;
