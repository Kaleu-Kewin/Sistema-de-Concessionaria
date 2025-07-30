def validar_enum(enum_class, valor):
    try:
        return enum_class(valor)
    except ValueError:
        return None