from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    # @staticmethod
    # def read_status_lampen():
    #     sql = "SELECT * from lampen"
    #     return Database.get_rows(sql)

    # @staticmethod
    # def read_status_lamp_by_id(id):
    #     sql = "SELECT * from lampen WHERE id = %s"
    #     params = [id]
    #     return Database.get_one_row(sql, params)

    # @staticmethod
    # def update_status_lamp(id, status):
    #     sql = "UPDATE lampen SET status = %s WHERE id = %s"
    #     params = [status, id]
    #     return Database.execute_sql(sql, params)

    # @staticmethod
    # def update_status_alle_lampen(status):
    #     sql = "UPDATE lampen SET status = %s"
    #     params = [status]
    #     return Database.execute_sql(sql, params)
    @staticmethod
    def read_horses():
        sql="SELECT * FROM horses "
        return Database.get_rows(sql)

    @staticmethod
    def read_horsename():
        sql="SELECT HorseId, naam FROM horses "
        return Database.get_rows(sql)

    @staticmethod
    def add_horse(naam, leeftijd):
        sql="INSERT INTO `horses` (`naam`,`leeftijd` ) VALUES (%s, %s);"
        params = [naam, leeftijd]
        return Database.execute_sql(sql, params)


    @staticmethod
    def read_history():
        sql="SELECT H.naam,W.Datum, W.Afstand FROM wandelingHistoriek as W LEFT JOIN horses as H ON W.HorseId=H.HorseId ORDER BY W.Datum desc LIMIT 30 ;"
        return Database.get_rows(sql)

    # @staticmethod
    # def read_ldr():
    #     sql="SELECT waarde from ldr ORDER BY ldrID desc LIMIT 1;"
    #     return Database.get_rows(sql)


    # @staticmethod
    # def create_log_ldr(Waarde):
    #     sql = "INSERT INTO `horses`.`ldr` (`waarde`) VALUES (%s);"
    #     params = [Waarde]
    #     return Database.execute_sql(sql, params)

    @staticmethod
    def create_log_meethistoriek(device, actie, datum, waarde, commentaar):
        sql="INSERT INTO Historiek(`DeviceId`,`Actieid`,`Actiedatum`,`Waarde`,`Commentaar`) VALUES (%s,%s,%s,%s,%s)"
        params = [device, actie, datum, waarde, commentaar]
        return Database.execute_sql(sql, params)